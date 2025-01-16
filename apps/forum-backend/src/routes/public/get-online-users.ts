import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getOnlineUsers() {
  return await forumDB
  .selectFrom("users_status")
  .select(["nickname"])
  .where("status", "=", true)
  .limit(7)
  .execute()
}

export const getOnlineUsersRoute = new Hono()
  .get("/get-online-users", async (ctx) => {
    try {
      const onlineUsers = await getOnlineUsers();

      return ctx.json({ data: onlineUsers }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })