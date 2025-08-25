import { throwError } from '#utils/throw-error.ts';
import { Hono } from "hono";
import type { ThreadPreview } from "@repo/types/entities/thread-type";
import { getThreadShorted } from '#lib/queries/thread/get-thread-shorted.ts';

async function getThreadPreview(threadId: string): Promise<ThreadPreview | null> {
  const thread = await getThreadShorted(threadId)

  if (!thread) return null;

  return {
    ...thread,
    properties: {
      is_comments: thread.is_comments
    },
    comments_count: thread.thread_comments_count,
    views_count: thread.thread_views_count,
    owner: {
      nickname: thread.nickname,
      name_color: thread.name_color,
      avatar: thread.avatar
    }
  }
}

export const getThreadPreviewRoute = new Hono()
  .get("/get-thread-preview/:id", async (ctx) => {
    const id = ctx.req.param("id");

    try {
      const data = await getThreadPreview(id);

      if (!data) {
        return ctx.json({ error: "Thread not found" }, 404);
      }

      return ctx.json<{ data: ThreadPreview }>({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })