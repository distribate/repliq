import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getLatestCategoryThreads } from "#lib/queries/categories/get-latest-category-threads.ts";
import { Hono } from "hono";

export const getLatestCategoryThreadsRoute = new Hono()
  .get("/get-latest-category-threads", async (ctx) => {
    try {
      const rankedThreads = await getLatestCategoryThreads();

      if (!rankedThreads) {
        return ctx.json({ error: "Threads not found" }, 404);
      }

      return ctx.json({ data: rankedThreads }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  );