import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getFriendRequests } from "#lib/queries/friend/get-friend-requests.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getFriendsRequestSchema } from "@repo/types/schemas/friend/get-friends-requests-schema.ts";

export const getFriendRequestsRoute = new Hono()
  .get("/get-friends-requests", zValidator("query", getFriendsRequestSchema), async (ctx) => {
    const query = await ctx.req.query();
    const { type } = getFriendsRequestSchema.parse(query);
    const nickname = getNickname();

    try {
      const outgoingFriendRequests = await getFriendRequests({
        nickname, type
      });

      return ctx.json({ data: outgoingFriendRequests }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
  )