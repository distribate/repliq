import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type GetUserFriendRequest = InitiatorRecipientType

export async function getUserFriendRequest({
  initiator, recipient
}: GetUserFriendRequest) {
  const friendRequestQuery = await forumDB
    .selectFrom("friends_requests")
    .select(["initiator", "recipient", "id"])
    .where((eb) =>
      eb.or([
        eb("initiator", "=", initiator),
        eb("recipient", "=", initiator),
      ])
    )
    .where((eb) =>
      eb.or([
        eb("initiator", "=", recipient),
        eb("recipient", "=", recipient),
      ])
    )
    .executeTakeFirst();

  if (!friendRequestQuery) return null;

  let requestObject: {
    status: "reject-request" | "accept-request",
    request_id: string
  }

  if (friendRequestQuery.initiator === initiator) {
    requestObject = {
      status: "reject-request",
      request_id: friendRequestQuery.id
    }

    return requestObject
  }

  if (friendRequestQuery.recipient === initiator) {
    requestObject = {
      status: "accept-request",
      request_id: friendRequestQuery.id
    }

    return requestObject
  }

  return null;
}

export async function getFriendObject({
  initiator,
  recipient
}: {
  initiator: string;
  recipient: string;
}) {
  return await forumDB
    .selectFrom("users_friends")
    .select("id")
    .select(["user_1", "user_2", "id"])
    .where((eb) =>
      eb.or([
        eb('user_1', '=', initiator),
        eb('user_2', '=', initiator),
      ]),
    )
    .where((eb) =>
      eb.or([
        eb('user_1', '=', recipient),
        eb('user_2', '=', recipient),
      ]),
    )
    .executeTakeFirst();
}