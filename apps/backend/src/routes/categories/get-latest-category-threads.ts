import { throwError } from '#utils/throw-error.ts';
import { getLatestCategoryThreads } from "#lib/queries/categories/get-latest-category-threads.ts";
import { Hono } from "hono";

export const getLatestCategoryThreadsRoute = new Hono()
  .get("/get-latest-category-threads", async (ctx) => {
    try {
      const data = await getLatestCategoryThreads();

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });