import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Issues } from "@repo/types/db/forum-database-types";
import { notifyIssueReceived } from "../utils/notify-issue-received";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import type {
  NotifyIssueReceived,
  NotifyLoginReceived,
  NotifyPaymentReceived,
  NotifyRegisterReceived,
  NotifyVoteReceived
} from "@repo/types/entities/notify-types"
import { createNotification } from "../lib/queries/create-notification";
import { issueMessage, loginMessage, paymentMessage, registerMessage, voteMessage } from "../messages/notifications";
import { forumDB } from "../shared/database/forum-db";
import { fasberryBot } from "../shared/bot/bot";
import { format } from "gramio";
import { logger } from "@repo/lib/utils/logger";

type Notify =
  | { type: "login", payload: NotifyLoginReceived }
  | { type: "issue", payload: NotifyIssueReceived }
  | { type: "vote", payload: NotifyVoteReceived }
  | { type: "register", payload: NotifyRegisterReceived }
  | { type: "payment", payload: NotifyPaymentReceived }

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

  const chat = await fasberryBot.api.getChat({ chat_id: id })

  await fasberryBot.api.sendMessage({ text, chat_id: id })
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
              user_nickname: notification.nickname,
              title: configIssueMessage,
              description: notification.message,
              created_at: notification.created_at,
              id: notification.id,
              type: notification.type as Issues["type"],
            })
          case "payment":
            return await createNotification({
              nickname: message.payload.nickname,
              message: paymentMessage(message.payload),
              type: "payment"
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