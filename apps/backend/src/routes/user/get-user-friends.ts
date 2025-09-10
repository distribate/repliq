import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { throwError } from '#utils/throw-error.ts';
import { getUserFriends } from "#lib/queries/user/get-user-friends.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getNickname } from "#lib/modules/context.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { userPreferenceAndPrivateValidation } from "#lib/validators/validate-user-preference-private.ts";

export async function getUserFriendsCount(nickname: string): Promise<number> {
  const query = await forumDB
    .selectFrom("users_friends")
    .select(forumDB.fn.countAll().as("count"))
    .where((eb) =>
      eb.or([
        eb("user_1", "=", nickname),
        eb("user_2", "=", nickname),
      ])
    )
    .executeTakeFirst();

  if (!query) return 0;

  return Number(query.count || 0)
}

export const getUserFriendsRoute = new Hono()
  .get("/user-friends/:nickname", zValidator("query", getUserFriendsSchema), async (ctx) => {
    const recipient = ctx.req.param("nickname")
    const initiator = getNickname()
    const result = getUserFriendsSchema.parse(ctx.req.query());

    const isValid = await userPreferenceAndPrivateValidation({
      initiator, recipient
    })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const data = await getUserFriends(recipient, result)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })