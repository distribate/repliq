import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { z } from "zod";
import { acceptFriendRequestTransaction } from "#lib/transactions/friend/accept-friend-request-transaction.ts";
import { publishAcceptFriendRequest } from '#publishers/pub-accept-friend-request.ts';

const acceptFriendRequestSchema = z.object({
  request_id: z.string()
})

export const acceptFriendRequestRoute = new Hono()
  .post("/accept-friend-request", zValidator("json", acceptFriendRequestSchema), async (ctx) => {
    const body = await ctx.req.json();
    const { request_id } = acceptFriendRequestSchema.parse(body);

    const initiator = getNickname()

    try {
      const { user_1, user_2 } = await acceptFriendRequestTransaction({ initiator, request_id })

      publishAcceptFriendRequest({ user_1: user_1, user_2: user_2 })

      return ctx.json({ status: "Friend request accepted" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
  );