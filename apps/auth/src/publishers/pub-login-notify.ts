import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"
import type { NotifyLoginReceived } from "@repo/types/entities/notify-types.ts"

export function publishLoginNotify({ browser, ip, nickname }: NotifyLoginReceived) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    type: "login",
    payload: { browser: browser ?? "Unknown", ip: ip ?? "Unknown", nickname }
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}