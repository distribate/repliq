import * as z from "zod";
import { throwError } from '#utils/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { publishAcceptFriendRequest } from '#publishers/pub-accept-friend-request.ts';
import { validateFriendsLength } from '#lib/validators/validate-friends-length.ts';
import { forumDB } from "#shared/database/forum-db.ts";
import { pushNotificationOnClient } from "#utils/push-notifications-on-client.ts";

const acceptFriendRequestSchema = z.object({
  request_id: z.string()
})

type AcceptFriendRequestTransaction = {
  initiator: string,
  request_id: string
}

async function acceptFriendRequestTransaction({
  request_id, initiator
}: AcceptFriendRequestTransaction) {
  return forumDB.transaction().execute(async (trx) => {
    const deleteRequest = await trx
      .deleteFrom('friends_requests')
      .where("id", "=", request_id)
      .where((eb) => eb.or([
        eb('initiator', '=', initiator),
        eb('recipient', '=', initiator),
      ]))
      .returning(["recipient", "initiator"])
      .executeTakeFirstOrThrow();

    const { recipient, initiator: requestInitiator } = deleteRequest

    return trx
      .insertInto('users_friends')
      .values({
        user_1: requestInitiator,
        user_2: recipient
      })
      .returning(["user_2", "user_1", "id"])
      .executeTakeFirstOrThrow();
  });
}

export const acceptFriendRequestRoute = new Hono()
  .post("/accept-request", zValidator("json", acceptFriendRequestSchema), async (ctx) => {
    const { request_id } = acceptFriendRequestSchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const isValid = await validateFriendsLength(nickname)

      if (!isValid) {
        return ctx.json({ error: "Max number of friends reached" }, 400)
      }

      const { user_1, user_2, id } = await acceptFriendRequestTransaction({ 
        initiator: nickname, request_id 
      })

      publishAcceptFriendRequest({ 
        user_1, user_2 
      })

      pushNotificationOnClient({
        event: "accept-friend-request",
        data: { recipient: user_1, initiator: user_2 }
      })

      const data = {
        data: {
          friend_id: id, 
        },
        status: "Friend request accepted"
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  });