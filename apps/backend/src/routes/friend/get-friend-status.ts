import { throwError } from '#utils/throw-error.ts';
import { getFriendObject, getUserFriendRequest } from "#lib/queries/friend/get-friend-status.ts";
import { getUserFriendPreference } from "#lib/queries/user/get-user-friend-preference.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";

type FriendStatus =
  | "reject-request"
  | "friend"
  | "accept-request"
  | "not-accepted-friend"
  | "not-friend"

type FriendData = {
  status: FriendStatus;
  friend_id: string | null;
  request_id: string | null
}

export const getFriendStatusRoute = new Hono()
  .get("/get-friend-status/:nickname", async (ctx) => {
    const recipient = ctx.req.param("nickname");

    const initiator = getNickname()

    let friendData: FriendData | null = null

    try {
      const friendPreference = await getUserFriendPreference(recipient)
      const friendObject = await getFriendObject({ initiator, recipient });

      if (!friendPreference && !friendObject) {
        friendData = {
          status: "not-accepted-friend", friend_id: null, request_id: null
        }

        return ctx.json({ data: friendData }, 200)
      }

      if (friendObject) {
        friendData = {
          status: "friend", friend_id: friendObject.id, request_id: null
        }
      } else {
        const friendRequest = await getUserFriendRequest({ initiator, recipient })

        if (friendRequest) {
          friendData = {
            status: friendRequest.status, friend_id: null, request_id: friendRequest.request_id
          }
        } else {
          friendData = {
            status: "not-friend", friend_id: null, request_id: null
          }
        }
      }

      return ctx.json({ data: friendData }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });