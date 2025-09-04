import { getNatsConnection } from "@repo/config-nats/nats-client";
import type { Issues } from "@repo/types/db/forum-database-types";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import type {
  NotifyIssueReceived,
  NotifyLoginReceived,
  NotifyRegisterReceived,
  NotifyVoteReceived
} from "@repo/types/entities/notify-types"
import { issueMessage, loginMessage, registerMessage, voteMessage } from "../messages/notifications.ts";
import { forumDB } from "../shared/database/forum-db";
import { repliqBot } from "../shared/bots/init.ts";
import { format } from "gramio";
import { logger } from "@repo/shared/utils/logger.ts";
import { servicedBot } from "../shared/bots/init.ts"
import type { Selectable } from "kysely"
import { getAdmins } from "../lib/queries/get-admins"

type Notify =
  | { type: "login", payload: NotifyLoginReceived }
  | { type: "issue", payload: NotifyIssueReceived }
  | { type: "vote", payload: NotifyVoteReceived }
  | { type: "register", payload: NotifyRegisterReceived }

type NotifyPreference = "notify_in_telegram"

const validateUserNotifyPreference = async ({ 
  nickname, preference 
}: { nickname: string, preference: NotifyPreference }) => {
  const query = await forumDB
    .selectFrom("users_settings")
    .select(preference)
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  return query ? query[preference] : false
}

const notifyInTelegram = async (values: NotifyLoginReceived) => {
  let isValid = await validateUserNotifyPreference({ 
    nickname: values.nickname, preference: "notify_in_telegram" 
  })

  if (!isValid) return;

  const tgId = await forumDB
    .selectFrom("users_connections")
    .select("value")
    .where("type", "=", "telegram")
    .where("nickname", "=", values.nickname)
    .executeTakeFirst()

  if (!tgId) return;

  const id = tgId.value

  const text = format`
    👣 Кто-то вошел в ваш аккаунт!
    
    Если это были не вы, обратитесь в службу поддержки!

    IP: ${values.ip}
    Browser: ${values.browser}
  `

  const chat = await repliqBot.api.getChat({ chat_id: id })

  await repliqBot.api.sendMessage({ text, chat_id: id })
}

type CreateNotification = {
  nickname: string
  message: string
  type: string
}

async function createNotification({ nickname, message, type }: CreateNotification) {
  const query = await forumDB
    .insertInto("notifications")
    .values({ nickname, message, type })
    .returningAll()
    .executeTakeFirstOrThrow();

  return query;
}

const notifyIssueReceived = async (issue: Selectable<Issues>) => {
  const admins = await getAdmins()

  const message = format`
  ${issue.title}
  Описание: ${issue.description}
  Создана: ${issue.created_at}
  Создал: ${issue.nickname}
  Тип: ${issue.type}
`

  for (const { telegram_id } of admins) {
    if (!telegram_id) continue

    await servicedBot.api.sendMessage({
      chat_id: telegram_id,
      text: message
    })
  }
}

export const subscribeReceiveNotify = () => {
  const nc = getNatsConnection()

  return nc.subscribe(USER_NOTIFICATIONS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        logger.error(err.message)
        return;
      }

      const message = msg.json<Notify>()

      try {
        switch (message.type) {
          case "login":
            notifyInTelegram(message.payload)

            return await createNotification({
              nickname: message.payload.nickname,
              message: loginMessage(message.payload),
              type: "auth"
            })
          case "register":
            return await createNotification({
              nickname: message.payload.nickname,
              message: registerMessage(message.payload),
              type: "auth"
            })
          case "vote":
            return await createNotification({
              nickname: message.payload.nickname,
              message: voteMessage,
              type: "vote"
            })
          case "issue":
            const notification = await createNotification({
              nickname: message.payload.nickname,
              message: issueMessage(message.payload),
              type: "issue"
            })

            const configIssueMessage = `Заявка ${message.payload.title} создана пользователем ${message.payload.nickname}`

            return await notifyIssueReceived({
              nickname: notification.nickname,
              title: configIssueMessage,
              description: notification.message,
              created_at: notification.created_at,
              id: notification.id,
              type: notification.type as Issues["type"],
            })
        }
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message)
        }
      }
    }
  })
}