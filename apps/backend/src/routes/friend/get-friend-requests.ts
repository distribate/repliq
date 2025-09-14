import { throwError } from '#utils/throw-error.ts';
import { getFriendRequests } from "#lib/queries/friend/get-friend-requests.ts";
import { getNickname } from "#lib/modules/context.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getFriendsRequestSchema } from "@repo/types/schemas/friend/get-friends-requests-schema.ts";

export const getFriendRequestsRoute = new Hono()
  .get("/friends-requests", zValidator("query", getFriendsRequestSchema), async (ctx) => {
    const { type, cursor } = getFriendsRequestSchema.parse(ctx.req.query());
    const nickname = getNickname();

    try {
      const data = await getFriendRequests(nickname, { type, cursor });

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400);
    }
  })