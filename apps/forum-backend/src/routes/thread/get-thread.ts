import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getThreadMain } from "#lib/queries/thread/get-thread-main.ts";
import type { ThreadDetailed } from "@repo/types/entities/thread-type";

type GetThread = {
  threadId: string;
  nickname: string
}

async function getThread({
  threadId
}: Omit<GetThread, "nickname">): Promise<ThreadDetailed | null> {
  const thread = await getThreadMain(threadId)

  if (!thread) return null;

  return {
    ...thread,
    category_id: Number(thread.category_id),
    threads_comments_count: Number(thread.threads_comments_count),
    owner: {
      nickname: thread.nickname!,
      name_color: thread.name_color
    }
  };
}

export const getThreadRoute = new Hono()
  .get("/get-thread/:threadId", async (ctx) => {
    const { threadId } = ctx.req.param();

    const nickname = getNickname()

    try {
      const thread = await getThread({ threadId });

      if (!thread) {
        return ctx.json({ error: "Thread not found" }, 404)
      }

      return ctx.json<{ data: ThreadDetailed }>({ data: thread }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )