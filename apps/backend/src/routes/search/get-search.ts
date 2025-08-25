import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { sql } from "kysely";
import * as z from "zod";

const getSearchSchema = z.object({
  type: z.enum(["user", "thread"]),
  query: z.string(),
  limit: z.string().transform(Number).optional()
})

type GetSearch = Omit<z.infer<typeof getSearchSchema>, "type">

const DEFAULT_SEARCH_LIMIT = 10

async function getSearchThreads({ query, limit }: GetSearch) {
  const safeQuery = query.trim();

  const result = await forumDB
    .selectFrom("threads")
    .leftJoin(
      forumDB
        .selectFrom("threads_images")
        .select([
          "thread_id",
          sql<string[]>`array_agg(DISTINCT image_url)`.as("images")
        ])
        .groupBy("thread_id")
        .as("images_agg"),
      "images_agg.thread_id",
      "threads.id"
    )
    .select([
      "threads.id",
      "threads.title",
      'threads.description',
      sql<string[]>`COALESCE(images_agg.images, '{}')`.as("images"),
    ])
    .where(sql<boolean>`title ILIKE '%' || ${safeQuery} || '%'`)
    .orderBy(sql`similarity(title, ${safeQuery}) DESC`)
    .groupBy([
      'threads.id',
      'threads.description',
      "threads.title",
      "images_agg.images"
    ])
    .limit(limit ?? DEFAULT_SEARCH_LIMIT)
    .execute()

  return result.map((thread) => ({
    ...thread,
    images: thread.images.map(image => getPublicUrl("threads", image))
  }));
}

async function getSearchUsers({ query, limit }: GetSearch) {
  const safeQuery = query.trim();

  const result = await forumDB
    .selectFrom("users")
    .select([
      "nickname",
      "name_color",
      "avatar",
      "description"
    ])
    .where(sql<boolean>`nickname ILIKE '%' || ${safeQuery} || '%'`)
    .orderBy(sql`similarity(nickname, ${safeQuery}) DESC`)
    .limit(limit ?? DEFAULT_SEARCH_LIMIT)
    .execute();

  return result;
}

export const getSearchRoute = new Hono()
  .get("/get-search", zValidator("query", getSearchSchema), async (ctx) => {
    const { type, ...result } = getSearchSchema.parse(ctx.req.query())

    try {
      switch (type) {
        case "thread":
          const threads = await getSearchThreads(result)

          ctx.res.headers.set("Cache-Control", "public, max-age=60") 

          return ctx.json({ data: threads }, 200)
        case "user":
          const users = await getSearchUsers(result)

          ctx.res.headers.set("Cache-Control", "public, max-age=60") 
          
          return ctx.json({ data: users }, 200)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })