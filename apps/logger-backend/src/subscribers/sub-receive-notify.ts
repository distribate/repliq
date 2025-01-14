import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Issues } from "@repo/types/db/forum-database-types";
import { forumDB } from "../shared/database/forum-db";
import { notifyIssueReceived } from "../utils/notify-issue-received";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";

type NotifyLoginReceived = {
  session_id: string
  nickname: string
}

type NotifyRegisterReceived = {
  session_id: string
  nickname: string
}

type NotifyIssueReceived = {
  title: string,
  user_nickname: string
}

type Notify =
  | { type: "login", payload: NotifyLoginReceived }
  | { type: "register", payload: NotifyRegisterReceived }
  | { type: "issue", payload: NotifyIssueReceived }

export const subscribeReceiveNotify = async () => {
  const nc = getNatsConnection()

  return nc.subscribe(USER_NOTIFICATIONS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const message = msg.json<Notify>()

      switch (message.type) {
        case "login":
          const { nickname, session_id } = message.payload;

          try {
            await forumDB
              .insertInto("notifications")
              .values({
                nickname,
                message: `Кто-то вошел в ваш аккаунт. ${session_id}`,
                type: "auth"
              })
              .returningAll()
              .executeTakeFirstOrThrow();
          } catch (error) {
            console.error("Error sending issue logs: ", error);
          }
          break;

        case "issue":
          const { title, user_nickname } = message.payload;

          try {
            await forumDB.transaction().execute(async (trx) => {
              const slicedTitle = title.length > 16
                ? title.slice(0, 16) + "..."
                : title;

              const notification = await trx
                .insertInto("notifications")
                .values({
                  nickname: user_nickname,
                  message: `Ваша заявка ${slicedTitle} была создана`,
                  type: "issue"
                })
                .returningAll()
                .executeTakeFirstOrThrow()

              return await notifyIssueReceived({
                user_nickname: notification.nickname,
                title: notification.message,
                description: notification.message,
                created_at: notification.created_at,
                id: notification.id,
                type: notification.type as Issues["type"],
              })
            })
          } catch (e) {
            console.error("Error sending issue logs: ", e);
          }
          break;
        case "register":

          break;
      }
    }
  })
}