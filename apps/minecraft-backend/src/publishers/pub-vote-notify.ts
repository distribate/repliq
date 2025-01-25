import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"

export function publishVoteNotify(nickname: string) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    type: "vote",
    payload: { nickname }
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}