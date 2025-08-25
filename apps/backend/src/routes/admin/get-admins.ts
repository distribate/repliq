import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

export const getAdminsRoute = new Hono()
  .get("/get-admins", async (ctx) => {
    try {
      const data = await forumDB
        .selectFrom("admins")
        .innerJoin("users", "users.nickname", "admins.nickname")
        .select([
          "admins.id",
          "admins.created_at",
          "admins.nickname",
          "admins.telegram_id",
          "admins.user_id",
          "users.avatar",
          "users.description"
        ])
        .execute()

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })