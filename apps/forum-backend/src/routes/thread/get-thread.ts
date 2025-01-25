import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { Hono } from "hono";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { ThreadDetailed } from "@repo/types/entities/thread-type";
import { getThread } from '#lib/queries/thread/get-thread.ts';

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