import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"

type NotifyLoginReceived = {
  session_id: string
  nickname: string
}

export async function publishLoginNotify({ session_id, nickname }: NotifyLoginReceived) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    payload: {
      session_id,
      nickname,
    },
    type: "login"
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}