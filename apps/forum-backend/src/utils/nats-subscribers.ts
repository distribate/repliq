import { subNotifications } from "#subscribers/sub-notifications.ts";

export async function natsSubscribe() {
  await subNotifications()
}