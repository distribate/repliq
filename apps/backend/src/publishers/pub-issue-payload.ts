import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import type { NotifyIssueReceived } from "@repo/types/entities/notify-types";

export function publishIssuePayload({ nickname, title }: NotifyIssueReceived) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    payload: {
      title,
      nickname,
    },
    type: "issue"
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}