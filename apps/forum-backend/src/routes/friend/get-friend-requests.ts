import { throwError } from "#helpers/throw-error.ts";
import { getFriendRequests } from "#lib/queries/friend/get-friend-requests.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const getFriendsRequestSchema = z.object({
  type: z.enum(["incoming", "outgoing"])
});

export const getFriendRequestsRoute = new Hono()
  .get("/get-friend-requests", zValidator("query", getFriendsRequestSchema), async (ctx) => {
    const query = await ctx.req.query();
    const { type } = getFriendsRequestSchema.parse(query);
    const nickname = getNickname();

    try {
      const outgoingFriendRequests = await getFriendRequests({
        nickname, type
      });

      return ctx.json(outgoingFriendRequests, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  }
  )