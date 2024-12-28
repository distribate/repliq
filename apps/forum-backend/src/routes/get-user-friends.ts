import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { throwError } from "#helpers/throw-error.ts";
import { getUserFriends } from "#lib/queries/get-user-friends.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const getUserFriendsRoute = new Hono()
.get("/get-user-friends/:nickname", zValidator("query", getUserFriendsSchema), async (ctx) => {
  const { nickname } = ctx.req.param()
  const result = getUserFriendsSchema.parse(ctx.req.query());
  
  let friends;

  try {
    friends = await getUserFriends({ nickname, ...result })
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500)
  }

  return ctx.json(friends, 200)
})