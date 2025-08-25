import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

export const getPublicStatsRoute = new Hono()
  .get("/get-public-stats", async (ctx) => {
    try {
      const [threads, users, posts] = await Promise.all([
        forumDB
          .selectFrom("threads")
          .select(eb => eb.fn.countAll("threads").as("count"))
          .executeTakeFirst(),
        forumDB
          .selectFrom("users")
          .select(eb => eb.fn.countAll("users").as("count"))
          .executeTakeFirst(),
        forumDB
          .selectFrom("posts")
          .select(eb => eb.fn.countAll("posts").as("count"))
          .executeTakeFirst()
      ])

      const data = {
        threads_count: threads?.count ?? 0,
        users_count: users?.count ?? 0,
        posts_count: posts?.count ?? 0
      }

      ctx.header("Cache-Control", "public, max-age=300")

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })