import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Issues } from "@repo/types/db/forum-database-types";
import { notifyIssueReceived } from "../utils/notify-issue-received";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import type {
  NotifyBase,
  NotifyIssueReceived,
  NotifyLoginReceived,
  NotifyPaymentReceived,
  NotifyRegisterReceived,
  NotifyVoteReceived
} from "@repo/types/entities/notify-types"
import { createNotification } from "../lib/queries/create-notification";

type Notify =
  | { type: "login", payload: NotifyLoginReceived }
  | { type: "register", payload: NotifyRegisterReceived }
  | { type: "issue", payload: NotifyIssueReceived }
  | { type: "vote", payload: NotifyVoteReceived }
  | { type: "register", payload: NotifyBase }
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

      switch (message.type) {
        case "login":
          try {
            await createNotification({
              nickname: message.payload.nickname,
              message: `Кто-то вошел в ваш аккаунт. ${message.payload.browser.slice(0, 64)} / ${message.payload.ip.slice(0, 64)}`,
              type: "auth"
            })
          } catch (error) {
            console.error("Error sending auth logs: ", error);
          }
          break;
        case "register":
          try {
            await createNotification({
              nickname: message.payload.nickname,
              message: `Добро пожаловать, ${message.payload.nickname}! Надеюсь тебе понравится на проекте 😏`,
              type: "auth"
            })
          } catch (error) {
            console.error("Error sending auth logs: ", error);
          }
          break;
        case "vote":
          try {
            await createNotification({
              nickname: message.payload.nickname,
              message: `Спасибо за голос! Награда отправлена 🤖`,
              type: "vote"
            })
          } catch (e) {
            console.error("Error sending vote logs: ", e);
          }
          break;
        case "issue":
          try {
            const slicedTitle = message.payload.title.length > 16
              ? message.payload.title.slice(0, 16) + "..."
              : message.payload.title;

            const notification = await createNotification({
              nickname: message.payload.nickname,
              message: `Ваша заявка ${slicedTitle} была создана`,
              type: "issue"
            })

            await notifyIssueReceived({
              user_nickname: notification.nickname,
              title: notification.message,
              description: notification.message,
              created_at: notification.created_at,
              id: notification.id,
              type: notification.type as Issues["type"],
            })
          } catch (e) {
            console.error("Error sending issue logs: ", e);
          }
          break;
        case "payment":
          let msg: string | null = null;

          if (message.payload.paymentType === 'donate') {
            msg = `привилегии ${message.payload.paymentValue}!`
          } else if (message.payload.paymentType === 'belkoin') {
            msg = `${message.payload.paymentValue} белкоинов!`
          } else if (message.payload.paymentType === 'charism') {
            msg = `${message.payload.paymentValue} харизмы!`
          }

          if (!msg) return;

          try {
            await createNotification({
              nickname: message.payload.nickname,
              message: `Спасибо за покупку ${msg}`,
              type: "payment"
            })
          } catch (e) {
            console.error(e)
          }
          break;
      }
    }
  })
}