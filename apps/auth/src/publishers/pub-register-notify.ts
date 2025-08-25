import { getNatsConnection } from "@repo/config-nats/nats-client"
import { LOGS_ADMIN_SUBJECT, USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"

export const publishRegisterNotify = (nickname: string) => {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    type: "register",
    payload: { nickname },
  })

  nc.publish(LOGS_ADMIN_SUBJECT, JSON.stringify({ type: "register", data: { nickname } }))
  nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}