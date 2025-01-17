import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { Hono } from "hono";
import type { ThreadPreview } from "@repo/types/entities/thread-type.ts";
import { getThreadShorted } from "#lib/queries/thread/get-thread-shorted.ts";

async function getThreadPreview(threadId: string): Promise<ThreadPreview | null> {
  const thread = await getThreadShorted(threadId)

  if (!thread) return null;

  return {
    ...thread,
    owner: {
      nickname: thread.user_nickname,
      name_color: thread.name_color
    }
  }
}

export const getThreadPreviewRoute = new Hono()
  .get("/get-thread-preview/:threadId", async (ctx) => {
    const { threadId } = ctx.req.param();

    try {
      const thread = await getThreadPreview(threadId);

      if (!thread) {
        return ctx.json({ error: "Thread not found" }, 404);
      }

      return ctx.json<{ data: ThreadPreview }>({ data: thread }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )