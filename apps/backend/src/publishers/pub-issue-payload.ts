import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";

type PublishIssuePayload = {
  title: string;
  nickname: string;
}

export function publishIssuePayload({ nickname, title }: PublishIssuePayload) {
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