import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

export async function validateAdmin(nickname: string): Promise<boolean> {
  const exists = await forumDB
    .selectFrom("admins")
    .select("nickname")
    .where("nickname", "=", nickname)
    .executeTakeFirst()
    
  return !!exists
}

export const getIsAdminRoute = new Hono()
  .get("/get-is-admin", async (ctx) => {
    const nickname = getNickname()

    try {
      const isAdmin = await validateAdmin(nickname)

      ctx.header("Cache-Control", "public, max-age=120")

      return ctx.json({ data: isAdmin }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })