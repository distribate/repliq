import { throwError } from "#helpers/throw-error.ts";
import { Hono } from "hono";
import { getThreadOwner } from "#lib/queries/thread/get-thread-owner.ts";
import type { ThreadPreview } from "@repo/types/entities/thread-type.ts";
import { getThreadShorted } from "#lib/queries/thread/get-thread-shorted.ts";

async function getThreadPreview(threadId: string): Promise<ThreadPreview | null> {
  const [main, owner] = await Promise.all([
    getThreadShorted(threadId),
    getThreadOwner(threadId)
  ]);

  if (!main || !owner) return null;

  return { ...main, owner }
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