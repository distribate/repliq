import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { forumDB } from "#shared/database/forum-db.ts";
import { Hono } from "hono";

async function getUserBanDetails(nickname: string) {
  const query = await forumDB
    .selectFrom("users_banned")
    .selectAll()
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  return query;
}

export const getUserBanDetailsRoute = new Hono()
  .get("/get-user-ban-details/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const userBanDetails = await getUserBanDetails(nickname)

      if (!userBanDetails) {
        return ctx.json({ data: null }, 200)
      }

      return ctx.json({ data: userBanDetails }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })