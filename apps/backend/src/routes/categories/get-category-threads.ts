import { getThreadsCategories } from "#lib/queries/categories/get-category-threads.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import { throwError } from '#utils/throw-error.ts';

export const getCategoryThreadsSchema = z.object({
  limit: z.string().transform(Number).optional(),
  cursor: z.string().optional(),
  ascending: z.string().transform((val) => val === "true").optional(),
  searchQuery: z.string().optional(),
  type: z.enum(["created_at", "views_count"])
})

export const getCategoryThreadsRoute = new Hono()
  .get("/threads/:id", zValidator("query", getCategoryThreadsSchema), async (ctx) => {
    const id = ctx.req.param("id");
    const result = getCategoryThreadsSchema.parse(ctx.req.query());

    try {
      const data = await getThreadsCategories(id, result);

      if (result.searchQuery && result.searchQuery.length >= 1) {
        ctx.res.headers.set("Cache-Control", "public, max-age=20") 
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })