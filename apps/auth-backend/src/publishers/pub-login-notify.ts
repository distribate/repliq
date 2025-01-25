import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"
import type { NotifyLoginReceived } from "@repo/types/entities/notify-types.ts"

export async function publishLoginNotify({ browser, ip, nickname }: NotifyLoginReceived) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    payload: { browser, ip, nickname },
    type: "login"
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}