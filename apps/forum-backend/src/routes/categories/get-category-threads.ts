import { getThreadsCategories } from "#lib/queries/categories/get-category-threads.ts";
import { zValidator } from "@hono/zod-validator";
import { queryRouteSchema } from "@repo/types/schemas/global/query-route-schema";
import { Hono } from "hono";
import { z } from "zod";
import { throwError } from '@repo/lib/helpers/throw-error.ts';

export const getCategoryThreadsSchema = z.object({
  limit: z.string().transform(Number).optional()
}).merge(queryRouteSchema);

export const getCategoryThreadsRoute = new Hono()
  .get("/get-category-threads/:category_id", zValidator("query", getCategoryThreadsSchema), async (ctx) => {
    const { category_id } = ctx.req.param();
    const query = ctx.req.query();
    const { limit, range, ascending } = getCategoryThreadsSchema.parse(query);

    try {
      const threads = await getThreadsCategories({ category_id, limit, range, ascending });
      return ctx.json(threads, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )