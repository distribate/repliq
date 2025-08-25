import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

async function getCategory(id: string) {
  const query = await forumDB
    .selectFrom("category")
    .select(["title", "description"])
    .where("id", "=", id)
    .executeTakeFirstOrThrow()

  return query;
}

export const getCategoryRoute = new Hono()
  .get("/get-category/:id", async (ctx) => {
    const id = ctx.req.param("id");

    try {
      const category = await getCategory(id)

      ctx.header("Cache-Control", "public, max-age=300")
      
      return ctx.json({ data: category }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })