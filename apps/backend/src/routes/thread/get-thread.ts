import { throwError } from '#utils/throw-error.ts';
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { ThreadDetailed } from "@repo/types/entities/thread-type";
import { getThread } from '#lib/queries/thread/get-thread.ts';
import { forumDB } from '#shared/database/forum-db.ts';

async function createThreadView(nickname: string, thread_id: string) {
  const query = await forumDB
    .insertInto("threads_views")
    .values({
      thread_id, nickname
    })
    .onConflict((cb) => cb.doNothing())
    .execute()

  return query;
}

export const getThreadRoute = new Hono()
  .get("/get-thread/:id", async (ctx) => {
    const id = ctx.req.param("id");
    const nickname = getNickname(true)

    try {
      const data = await getThread({ id, nickname });

      if (!data) {
        return ctx.json({ error: "Thread not found" }, 404)
      }

      if (nickname) {
        createThreadView(nickname, id)
      }

      return ctx.json<{ data: ThreadDetailed }>({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })