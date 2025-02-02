import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getUserStatus(nickname: string) {
  return await forumDB
    .selectFrom("users_status")
    .select(["created_at"])
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()
}

const DEFAULT_EXPIRE_ONLINE = 5 * 60 * 1000 // 5 minutes

export const getUserStatusRoute = new Hono()
  .get("/get-user-status/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const { created_at } = await getUserStatus(nickname)

      let status: "online" | "offline" = "offline";

      if (Date.now() - created_at.getTime() > DEFAULT_EXPIRE_ONLINE) {
        status = "offline";
      } else {
        status = "online";
      }

      return ctx.json({ data: { status, last_active: created_at } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })