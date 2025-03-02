import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";

const LIMIT = 5;

async function getLatestThreads({ limit }: { limit?: number }) {
  const query = await forumDB
    .selectFrom("threads")
    .select(["id", "title", "description"])
    .limit(limit ?? LIMIT)
    .execute()

  return query;
}

const getLatestThreadsSchema = z.object({
  limit: z.string().transform(Number).optional()
})

export const getLatestThreadsRoute = new Hono()
  .get("/get-latest-threads", zValidator("query", getLatestThreadsSchema), async (ctx) => {
    const result = getLatestThreadsSchema.parse(ctx.req.query());

    try {
      const latestThreads = await getLatestThreads(result);

      return ctx.json({ data: latestThreads }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })