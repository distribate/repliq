import { getThreadsCategories } from "#lib/queries/categories/get-category-threads.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { throwError } from '#utils/throw-error.ts';
import * as z from "zod";

export const additionalFilterSchema = z.object({
  cursor: z.string().optional(),
  ascending: z.string().transform((val) => val === "true").optional(),
  searchQuery: z.string().optional()
})

export const getCategoryThreadsSchema = z.intersection(
  additionalFilterSchema,
  z.object({
    limit: z.string().transform(Number).optional(),
    type: z.enum(["created_at", "views_count"])
  })
)

export const getCategoryThreadsRoute = new Hono()
  .get("/threads/:id", zValidator("query", getCategoryThreadsSchema), async (ctx) => {
    const id = ctx.req.param("id");
    const result = getCategoryThreadsSchema.parse(ctx.req.query());
    
    const bySearched: boolean = result.searchQuery ? result.searchQuery.length >= 2 : false
    
    try {
      const data = await getThreadsCategories(id, result);

      if (bySearched) {
        ctx.res.headers.set("Cache-Control", "public, max-age=30")
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })