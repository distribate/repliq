import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import type { Selectable } from "kysely"
import type { Issues } from "@repo/types/db/forum-database-types";
import type {
  NotifyIssueReceived,
  NotifyLoginReceived,
  NotifyRegisterReceived,
  NotifyVoteReceived
} from "@repo/types/entities/notify-types"
import { issueMessage, loginMessage, registerMessage, voteMessage } from "../shared/messages/notifications.ts";
import { forumDB } from "../shared/database/forum-db";
import { repliqBot } from "../shared/bots/init.ts";
import { format } from "gramio";
import { logger } from "@repo/shared/utils/logger.ts";
import { servicedBot } from "../shared/bots/init.ts"
import { getAdmins } from "../lib/queries/get-admins"

type NotifyMap = {
  login: NotifyLoginReceived;
  issue: NotifyIssueReceived;
  vote: NotifyVoteReceived;
  register: NotifyRegisterReceived;
};

type Notify = { [K in keyof NotifyMap]: { type: K; payload: NotifyMap[K] } }[keyof NotifyMap];

type NotifyPreference = "notify_in_telegram"

type CreateNotification = {
  nickname: string
  message: string
  type: string
}

function createHandlers<H extends {
  [K in Notify["type"]]: (msg: Extract<Notify, { type: K }>) => Promise<void> | void;
}>(h: H): H {
  return h;
}

async function validateUserNotifyPreference({
  nickname, preference
}: { nickname: string, preference: NotifyPreference }): Promise<boolean> {
  const query = await forumDB
    .selectFrom("users_settings")
    .select(preference)
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()

  return query[preference]
}

function getNotifyMessage(values: NotifyLoginReceived) {
  return format`
    👣 Кто-то вошел в ваш аккаунт!
    
    Если это были не вы, обратитесь в службу поддержки!

    IP: ${values.ip}
    Browser: ${values.browser}
  `
}

function getNotifyIssueMessage(issue: Selectable<Issues>) {
  return format`
  ${issue.title}
  Описание: ${issue.description}
  Создана: ${issue.created_at}
  Создал: ${issue.nickname}
  Тип: ${issue.type}
`
}

async function notifyInTelegram(values: NotifyLoginReceived): Promise<void> {
  const isValid = await validateUserNotifyPreference({
    nickname: values.nickname,
    preference: "notify_in_telegram"
  })

  if (!isValid) return;

  const tgId = await forumDB
    .selectFrom("users_connections")
    .select("value")
    .where("type", "=", "telegram")
    .where("nickname", "=", values.nickname)
    .executeTakeFirst()

  if (!tgId) return;

  const text = getNotifyMessage(values);
  const chat = await repliqBot.api.getChat({ chat_id: tgId.value })

  await repliqBot.api.sendMessage({ text, chat_id: chat.id })
}

async function createNotification({ nickname, message, type }: CreateNotification) {
  const query = await forumDB
    .insertInto("notifications")
    .values({ nickname, message, type })
    .returningAll()
    .executeTakeFirstOrThrow();

  return query;
}

async function notifyIssueReceived(issue: Selectable<Issues>) {
  const text = getNotifyIssueMessage(issue);
  const admins = await getAdmins()

  for (const { telegram_id } of admins) {
    if (!telegram_id) continue

    await servicedBot.api.sendMessage({ chat_id: telegram_id, text })
  }
}

async function createAuthNotification(payload: Pick<NotifyLoginReceived, "nickname">, message: string) {
  return createNotification({ nickname: payload.nickname, message, type: "auth" });
};

async function createIssue(payload: NotifyIssueReceived) {
  const notification = await createNotification({
    nickname: payload.nickname,
    message: issueMessage(payload),
    type: "issue",
  });

  const configIssueMessage = `Заявка ${payload.title} создана пользователем ${payload.nickname}`;

  await notifyIssueReceived({
    nickname: notification.nickname,
    title: configIssueMessage,
    description: notification.message,
    created_at: notification.created_at,
    id: notification.id,
    type: notification.type as Issues["type"],
  });
}

const handlers = createHandlers({
  login: async ({ payload }) => {
    notifyInTelegram(payload);
    await createAuthNotification(payload, loginMessage(payload))
  },
  register: async ({ payload }) => {
    await createAuthNotification(payload, registerMessage(payload));
  },
  vote: async ({ payload }) => {
    await createNotification({ nickname: payload.nickname, message: voteMessage, type: "vote" });
  },
  issue: async ({ payload }) => {
    await createIssue(payload)
  }
})

export const subscribeReceiveNotify = () => {
  const nc = getNatsConnection()

  return nc.subscribe(USER_NOTIFICATIONS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        logger.error(err.message)
        return;
      }

      try {
        const message = msg.json<Notify>();

        switch (message.type) {
          case "login":
            await handlers.login(message);
            break;
          case "issue":
            await handlers.issue(message);
            break;
          case "vote":
            await handlers.vote(message);
            break;
          case "register":
            await handlers.register(message);
            break;
        }
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message);
        }
      }
    }
  })
}