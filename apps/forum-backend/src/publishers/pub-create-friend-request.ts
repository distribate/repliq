import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts"
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"

export function publishCreateFriendRequest({
  initiator, recipient
}: InitiatorRecipientType) {
  const nc = getNatsConnection()

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, JSON.stringify({
    type: "create-friend-request",
    payload: {
      recipient,
      initiator,
    }
  }))
}