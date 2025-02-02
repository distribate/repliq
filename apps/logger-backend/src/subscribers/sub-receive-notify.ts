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

type Notify =
  | { type: "login", payload: NotifyLoginReceived }
  | { type: "issue", payload: NotifyIssueReceived }
  | { type: "vote", payload: NotifyVoteReceived }
  | { type: "register", payload: NotifyRegisterReceived }
  | { type: "payment", payload: NotifyPaymentReceived }

export const subscribeReceiveNotify = () => {
  const nc = getNatsConnection()

  return nc.subscribe(USER_NOTIFICATIONS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const message = msg.json<Notify>()

      try {
        switch (message.type) {
          case "login":
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

            return await notifyIssueReceived({
              user_nickname: notification.nickname,
              title: notification.message,
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
        console.error(e)
      }
    }
  })
}