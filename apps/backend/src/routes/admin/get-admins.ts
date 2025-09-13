import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

async function getAdmins() {
  return forumDB
    .selectFrom("admins")
    .innerJoin("users", "users.nickname", "admins.nickname")
    .select([
      "admins.id",
      "admins.created_at",
      "admins.nickname",
      "admins.telegram_id",
      "admins.user_id",
      "users.avatar",
      "users.description",
      "users.name_color"
    ])
    .execute()
}

export const getAdminsRoute = new Hono()
  .get("/admins", async (ctx) => {
    try {
      const data = await getAdmins()

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })