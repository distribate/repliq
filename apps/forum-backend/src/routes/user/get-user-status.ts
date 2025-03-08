import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { DEFAULT_EXPIRE_ONLINE } from "#shared/constants/user-limits.ts"

async function getUserStatus(nickname: string) {
  const query = await forumDB
    .selectFrom("users_status")
    .select(["created_at"])
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()

  let status: "online" | "offline" = "offline";

  if (Date.now() - query.created_at.getTime() < DEFAULT_EXPIRE_ONLINE) {
    status = "online";
  }

  return { ...query, status }
}

export const getUserStatusRoute = new Hono()
  .get("/get-user-status/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const result = await getUserStatus(nickname)

      return ctx.json({ data: result }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })