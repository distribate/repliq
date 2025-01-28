import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getCategory(id: string) {
  return await forumDB
  .selectFrom("category")
  .select([
    "title",
    "description",
  ])
  .where("id", "=", id)
  .executeTakeFirstOrThrow()
}

export const getCategoryRoute = new Hono()
  .get("/get-category/:id", async (ctx) => {
    const { id } = ctx.req.param();

    try {
      const category = await getCategory(id)

      return ctx.json({ data: category }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })