import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { ThreadDetailed } from "@repo/types/entities/thread-type";
import { getThread } from '#lib/queries/thread/get-thread.ts';
import { forumDB } from '#shared/database/forum-db.ts';

async function createThreadView(nickname: string, threadId: string) {
  const query = await forumDB
    .insertInto("threads_views")
    .values({
      thread_id: threadId,
      user_nickname: nickname
    })
    .onConflict((c) => c.doNothing())
    .execute()

  return query;
}

export const getThreadRoute = new Hono()
  .get("/get-thread/:threadId", async (ctx) => {
    const { threadId } = ctx.req.param();
    const nickname = getNickname(true)

    try {
      const thread = await getThread({ id: threadId, nickname });

      if (!thread) {
        return ctx.json({ error: "Thread not found" }, 404)
      }

      if (nickname) {
        createThreadView(nickname, threadId)
      }

      return ctx.json<{ data: ThreadDetailed }>({ data: thread }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })