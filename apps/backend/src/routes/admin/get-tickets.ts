import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

async function getTickets() {
  return forumDB
    .selectFrom("issues")
    .innerJoin("users", "users.nickname", "issues.nickname")
    .select([
      "issues.id",
      "issues.created_at",
      "issues.description",
      "issues.nickname",
      "issues.type",
      "issues.title",
      "users.avatar",
      "users.name_color"
    ])
    .execute()
}

export const getTicketsRoute = new Hono()
  .get("/tickets", async (ctx) => {
    try {
      const data = await getTickets();

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })