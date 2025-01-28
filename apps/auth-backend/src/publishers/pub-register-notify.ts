import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"

export const publishRegisterNotify = (nickname: string) => {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    type: "register",
    payload: { nickname },
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}