import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCommentsSchema } from "@repo/types/schemas/comment/get-comments-schema.ts";
import { getThreadComments } from '#lib/queries/comments/get-thread-comments.ts';

export const getThreadCommentsRoute = new Hono()
  .get("/get-thread-comments/:threadId", zValidator("query", getCommentsSchema), async (ctx) => {
    const { threadId } = ctx.req.param();
    const query = ctx.req.query();
    const { limit, cursor } = getCommentsSchema.parse(query);

    try {
      const threadComments = await getThreadComments({
        limit: limit ?? null, cursor: cursor ?? undefined, threadId
      });

      return ctx.json(threadComments, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )