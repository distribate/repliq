import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getLatestRegUsers() {
  return await forumDB
    .selectFrom("users")
    .select(["id", "nickname"])
    .limit(7)
    .orderBy("created_at", "desc")
    .execute()
}

export const getLatestRegUsersRoute = new Hono()
  .get("/get-latest-reg-users", async (ctx) => {
    try {
      const users = await getLatestRegUsers()
      
      return ctx.json({ data: users }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })