import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { sql } from "kysely";

export const getSavedThreadsRoute = new Hono()
  .get("/get-saved-threads", async (ctx) => {
    const nickname = getNickname()

    try {
      const threadsSubquery = forumDB
        .selectFrom("threads_saved")
        .innerJoin("threads", "threads.id", "threads_saved.thread_id")
        .select([
          "threads.id",
          "threads.title",
          "threads.description",
          "threads_saved.created_at",
          "threads_saved.nickname as owner",
        ])
        .where("threads_saved.nickname", "=", nickname)
        .orderBy("threads_saved.created_at", "desc")
        .limit(32)
        .as("base_threads")

      const query = await forumDB
        .selectFrom(threadsSubquery)
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
          "base_threads.id"
        )
        .leftJoin(
          forumDB
            .selectFrom("comments")
            .where("parent_type", "=", "thread")
            .select([
              "parent_id",
              sql<number>`COUNT(*)`.as("comments_count")
            ])
            .groupBy("parent_id")
            .as("comments_count"),
          "comments_count.parent_id",
          "base_threads.id"
        )
        .leftJoin(
          forumDB
            .selectFrom("threads_views")
            .select([
              "thread_id",
              sql<number>`COUNT(*)`.as("views_count")
            ])
            .groupBy("thread_id")
            .as("views_count"),
          "views_count.thread_id",
          "base_threads.id"
        )
        .select([
          "base_threads.id",
          "base_threads.title",
          "base_threads.description",
          "base_threads.created_at",
          "base_threads.owner",
          sql<string[]>`COALESCE(images_agg.images, '{}')`.as("images"),
          sql<number>`COALESCE(comments_count.comments_count, 0)`.as("comments_count"),
          sql<number>`COALESCE(views_count.views_count, 0)`.as("views_count"),
        ])
        .execute()

      const data = query.map((item) => {
        const images = item.images.map(image => getPublicUrl("threads", image))
        return { ...item, images }
      })

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })