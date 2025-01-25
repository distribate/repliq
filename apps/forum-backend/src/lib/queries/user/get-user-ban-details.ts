import { forumDB } from "#shared/database/forum-db.ts"
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getUserBanDetails(nickname: string) {
  return await forumDB
  .selectFrom("users_banned")
  .selectAll()
  .where("nickname", "=", nickname)
  .executeTakeFirst();
}

export const getUserBanDetailsRoute = new Hono()
.get("/get-user-ban-details/:nickname", async (ctx) => {
  const { nickname } = ctx.req.param()

  try {
    const banDetails = await getUserBanDetails(nickname)

    return ctx.json({ data: banDetails }, 200)
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);
  }
})