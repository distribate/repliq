import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";

async function getLatestThreads({ limit }: { limit: number }) {
  return await forumDB
    .selectFrom("threads")
    .select(["id", "title", "description"])
    .limit(limit)
    .execute()
}

const getLatestThreadsSchema = z.object({
  limit: z.string().transform(Number).optional()
})

export const getLatestThreadsRoute = new Hono()
  .get("/get-latest-threads", zValidator("query", getLatestThreadsSchema), async (ctx) => {
    const { limit } = getLatestThreadsSchema.parse(ctx.req.query());

    try {
      const latestThreads = await getLatestThreads({ limit: limit ?? 5 });

      return ctx.json({ data: latestThreads }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })