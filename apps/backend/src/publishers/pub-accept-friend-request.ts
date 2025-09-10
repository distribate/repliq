import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"
import type { UsersFriends } from "@repo/types/db/forum-database-types"

type PublishAcceptFriendRequestType = Pick<UsersFriends, "user_1" | "user_2">

export function publishAcceptFriendRequest({ user_1, user_2 }: PublishAcceptFriendRequestType) {
  const nc = getNatsConnection()

  const payload = {
    type: "accept-friend-request",
    payload: {
      recipient: user_2,
      initiator: user_1,
    }
  }

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, JSON.stringify(payload))
}