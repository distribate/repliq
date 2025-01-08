import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getThreadMain } from "#lib/queries/thread/get-thread-main.ts";
import { getThreadOwner } from "#lib/queries/thread/get-thread-owner.ts";
import type { ThreadDetailed } from "@repo/types/entities/thread-type";

type GetThread = {
  threadId: string;
  nickname: string
}

async function getThread({
  threadId
}: Omit<GetThread, "nickname">): Promise<ThreadDetailed | null> {
  const [thread, threadCreator] = await Promise.all([
    getThreadMain(threadId),
    getThreadOwner({
      threadId
    }),
  ]);

  if (!thread || !threadCreator) return null;

  return { ...thread, owner: threadCreator };
}

export const getThreadRoute = new Hono()
  .get("/get-thread/:threadId", async (ctx) => {
    const { threadId } = ctx.req.param();

    const nickname = getNickname()

    try {
      const thread = await getThread({ threadId });

      if (!thread) return ctx.json({ error: "Thread not found" }, 404);

      return ctx.json<{ data: ThreadDetailed }>({ data: thread }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )