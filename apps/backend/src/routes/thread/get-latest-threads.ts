import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { sql } from "kysely";
import * as z from "zod";

const LIMIT = 5;

async function getLatestThreads({ limit }: { limit?: number }) {
  const query = await forumDB
    .selectFrom("threads")
    .innerJoin("threads_users", "threads.id", "threads_users.thread_id")
    .innerJoin("users", "threads_users.nickname", "users.nickname")
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
      "threads.description",
      "threads.created_at",
      "threads.updated_at",
      "threads.category_id",
      "threads.is_updated",
      "threads.is_comments",
      sql<string[]>`COALESCE(images_agg.images, '{}')`.as("images"),
      "users.nickname",
      "users.name_color",
      "users.avatar",
    ])
    .limit(limit ?? LIMIT)
    .groupBy([
      'threads.id',
      "threads.title",
      'threads.description',
      'threads.created_at',
      'threads.updated_at',
      "threads.category_id",
      'threads.is_updated',
      'threads.is_comments',
      "images_agg.images",
      "users.nickname",
      "users.avatar",
      "users.name_color",
    ])
    .execute()

  return query.map((thread) => {
    const { nickname, name_color, avatar, ...rest } = thread;

    const owner = {
      nickname: thread.nickname,
      name_color: thread.name_color,
      avatar: thread.avatar
    }

    const images = thread.images.length >= 1 ? thread.images.map((image) => getPublicUrl("threads", image)).slice(0) : []

    return {
      ...rest,
      owner,
      images
    }
  });
}

const getLatestThreadsSchema = z.object({
  limit: z.string().transform(Number).optional()
})

export const getLatestThreadsRoute = new Hono()
  .get("/latest-threads", zValidator("query", getLatestThreadsSchema), async (ctx) => {
    const result = getLatestThreadsSchema.parse(ctx.req.query());

    try {
      const data = await getLatestThreads(result);

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })