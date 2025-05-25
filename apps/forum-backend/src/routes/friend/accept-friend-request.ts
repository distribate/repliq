import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { z } from "zod";
import { acceptFriendRequestTransaction } from "#lib/transactions/friend/accept-friend-request-transaction.ts";
import { publishAcceptFriendRequest } from '#publishers/pub-accept-friend-request.ts';
import { validateFriendsLength } from '#lib/validators/validate-friends-length.ts';
import { pushNotificationOnClient } from '@repo/lib/utils/push-notifications-on-client.ts';

const acceptFriendRequestSchema = z.object({
  request_id: z.string()
})

export const acceptFriendRequestRoute = new Hono()
  .post("/accept-friend-request", zValidator("json", acceptFriendRequestSchema), async (ctx) => {
    const { request_id } = acceptFriendRequestSchema.parse(await ctx.req.json());

    const initiator = getNickname()

    try {
      const isValid = await validateFriendsLength(initiator)

      if (!isValid) {
        return ctx.json({ error: "Max number of friends reached" }, 400)
      }

      const { user_1, user_2, id } = await acceptFriendRequestTransaction({ initiator, request_id })

      publishAcceptFriendRequest({ 
        user_1, 
        user_2 
      })
      
      pushNotificationOnClient({
        event: "accept-friend-request",
        data: { recipient: user_1, initiator: user_2 }
      })

      return ctx.json({ friend_id: id, status: "Friend request accepted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  });