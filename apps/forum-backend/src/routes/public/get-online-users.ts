import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

const ONLINE_USERS_TIME = 5 * 60 * 1000
const DEFAULT_LIMIT = 7

async function getOnlineUsers(limit: number = DEFAULT_LIMIT) {
  const query = await forumDB
    .selectFrom("users_status")
    .innerJoin("users", "users.nickname", "users_status.nickname")
    .select([
      "users_status.nickname",
      "users.avatar"
    ])
    .where("created_at", ">", new Date(Date.now() - ONLINE_USERS_TIME))
    .limit(limit)
    .execute();

  return query;
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