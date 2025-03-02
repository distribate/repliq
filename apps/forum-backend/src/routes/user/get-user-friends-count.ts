import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { forumDB } from "#shared/database/forum-db.ts";
import { Hono } from "hono";

async function getUserFriendsCount(nickname: string) {
  const query = await forumDB
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

  return query?.count ?? 0
}

export const getUserFriendsCountRoute = new Hono()
  .get("/get-user-friends-count/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const friendsCount = await getUserFriendsCount(nickname)

      return ctx.json({ data: friendsCount }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })