import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";

type PublishIssuePayload = {
  title: string;
  user_nickname: string;
}

export async function publishIssuePayload({ user_nickname, title }: PublishIssuePayload) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    payload: {
      title,
      user_nickname,
    },
    type: "issue"
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}