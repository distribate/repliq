import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getUserStatus(nickname: string) {
  return await forumDB
    .selectFrom("users_status")
    .select(["status", "created_at"])
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()
}

export const getUserStatusRoute = new Hono()
  .get("/get-user-status/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const status = await getUserStatus(nickname)
      
      return ctx.json({ data: status }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })