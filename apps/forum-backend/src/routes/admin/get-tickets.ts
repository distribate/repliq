import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getTickets() {
  const query = await forumDB
    .selectFrom("issues")
    .selectAll()
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