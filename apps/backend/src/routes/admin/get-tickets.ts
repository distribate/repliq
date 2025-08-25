import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

async function getTickets() {
  const query = await forumDB
    .selectFrom("issues")
    .innerJoin("users", "users.nickname", "issues.nickname")
    .select([
      "issues.id",
      "issues.created_at",
      "issues.description",
      "issues.nickname",
      "issues.type",
      "issues.title",
      "users.avatar as user_avatar"
    ])
    .execute()

  return query;
}

export const getTicketsRoute = new Hono()
  .get("/get-tickets", async (ctx) => {
    try {
      const tickets = await getTickets();

      return ctx.json({ data: tickets }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })