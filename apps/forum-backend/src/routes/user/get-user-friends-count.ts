import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { forumDB } from "#shared/database/forum-db.ts";
import { Hono } from "hono";

async function getUserFriendsCount(nickname: string) {
  return await forumDB
    .selectFrom("users_friends")
    .select(forumDB.fn.countAll().as("count"))
    .where((eb) =>
      eb.or([
        eb("user_1", "=", nickname),
        eb("user_2", "=", nickname),
      ])
    )
    .$narrowType<{ count: number }>()
    .executeTakeFirst();
}

export const getUserFriendsCountRoute = new Hono()
  .get("/get-user-friends-count/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const friendsCount = await getUserFriendsCount(nickname)

      if (!friendsCount) {
        return ctx.json({ data: 0 }, 200)
      }

      return ctx.json({ data: friendsCount.count }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })