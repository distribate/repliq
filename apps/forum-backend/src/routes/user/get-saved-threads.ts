import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

export const getSavedThreadsRoute = new Hono()
  .get("/get-saved-threads", async (ctx) => {
    const nickname = getNickname()

    try {
      const query = await forumDB
        .selectFrom("threads_saved")
        .innerJoin("threads", "threads.id", "threads_saved.thread_id")
        .select([
          "threads.title",
          "threads.description",
          "threads.id",
          "threads_saved.created_at",
          "threads_saved.nickname"
        ])
        .where("nickname", "=", nickname)
        .execute()

      return ctx.json({ data: query }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })