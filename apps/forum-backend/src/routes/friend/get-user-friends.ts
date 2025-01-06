import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { throwError } from "#helpers/throw-error.ts";
import { getUserFriends } from "#lib/queries/user/get-user-friends.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";

export const getUserFriendsRoute = new Hono()
  .get("/get-user-friends/:nickname", zValidator("query", getUserFriendsSchema), async (ctx) => {
    const { nickname: requestedNickname } = ctx.req.param()
    const query = ctx.req.query()
    const result = getUserFriendsSchema.parse(query);

    const initiator = getNickname()

    try {
      const friends = await getUserFriends({ nickname: requestedNickname, ...result })
      return ctx.json(friends, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }
)