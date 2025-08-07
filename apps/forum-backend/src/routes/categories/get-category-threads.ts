import { getThreadsCategories } from "#lib/queries/categories/get-category-threads.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import { throwError } from '@repo/lib/helpers/throw-error.ts';

export const getCategoryThreadsSchema = z.object({
  limit: z.string().transform(Number).optional(),
  cursor: z.string().optional(),
  ascending: z.string().transform((val) => val === "true").optional(),
})

export const getCategoryThreadsRoute = new Hono()
  .get("/get-category-threads/:id", zValidator("query", getCategoryThreadsSchema), async (ctx) => {
    const id = ctx.req.param("id");
    const { limit, cursor, ascending } = getCategoryThreadsSchema.parse(ctx.req.query());

    try {
      const threads = await getThreadsCategories({ id, limit, cursor, ascending });

      return ctx.json({ data: threads }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })