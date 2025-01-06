import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { queryRouteSchema } from "@repo/types/schemas/global/query-route-schema";
import { Hono } from "hono";
import { z } from "zod";

const getCategoryThreadsSchema = z.object({
  limit: z.string().transform(Number).optional()
}).merge(queryRouteSchema);

type ThreadsFromCategories = z.infer<typeof getCategoryThreadsSchema> & {
  category_id: string
}

async function getThreadsCategories({
  category_id, ascending, limit, range
}: ThreadsFromCategories) {
  let query = forumDB
    .selectFrom("threads")
    .select(["threads.id", "threads.title", "threads.created_at", "threads.updated_at", "threads.visibility"])  
    .where("threads.category_id", "=", category_id);

  if (limit) query = query.limit(limit);
  if (range) query.offset(range[0]).limit(range[1] - range[0] + 1);

  return await query.execute();
}

export const getCategoryThreadsRoute = new Hono()
  .get("/get-category-threads/:category_id", zValidator("query", getCategoryThreadsSchema), async (ctx) => {
    const { category_id } = ctx.req.param();
    const query = ctx.req.query();
    const { limit, range, ascending } = getCategoryThreadsSchema.parse(query);

    try {
      const threads = await getThreadsCategories({ category_id, limit, range, ascending });
      return ctx.json(threads, 200);
    } catch (e) {
      return ctx.json({ error: e }, 500);
    }
  }
  )