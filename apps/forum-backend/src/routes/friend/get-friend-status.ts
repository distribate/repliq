import { throwError } from "#helpers/throw-error.ts";
import { getUserFriendPreference } from "#lib/queries/user/get-user-friend-preference.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

type GetUserFriendRequest = InitiatorRecipientType

async function getUserFriendRequest({
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

async function getFriendObject({
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

type FriendStatus = "reject-request" | "friend" | "accept-request" | "not-accepted-friend" | "not-friend"

export const getFriendStatusRoute = new Hono()
  .get("/get-friend-status/:nickname", async (ctx) => {
    const { nickname: recipient } = ctx.req.param();

    const initiator = getNickname()

    let friendData: {
      status: FriendStatus;
      friend_id: string | null;
      request_id: string | null
    };

    try {
      const friendPreference = await getUserFriendPreference(recipient)
      const friendObject = await getFriendObject({ initiator, recipient });

      if (!friendPreference && !friendObject) {
        friendData = {
          status: "not-accepted-friend",
          friend_id: null,
          request_id: null
        }

        return ctx.json(friendData, 200)
      }

      if (friendObject) {
        friendData = {
          status: "friend",
          friend_id: friendObject.id,
          request_id: null
        }
      } else {
        const friendRequest = await getUserFriendRequest({
          initiator, recipient
        })

        if (friendRequest) {
          friendData = {
            status: friendRequest.status,
            friend_id: null,
            request_id: friendRequest.request_id
          }
        } else {
          friendData = {
            status: "not-friend",
            friend_id: null,
            request_id: null
          }
        }
      }

      return ctx.json(friendData, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  );