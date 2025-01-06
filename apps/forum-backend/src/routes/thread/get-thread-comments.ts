import { Hono } from 'hono';
import { getThreadComments } from '#lib/queries/thread/get-thread-comments.ts';
import { throwError } from '#helpers/throw-error.ts';
import { zValidator } from '@hono/zod-validator';
import { getThreadCommentsSchema } from '@repo/types/schemas/thread/get-thread-comments-schema.ts';

export const getThreadCommentsRoute = new Hono()
.get("/get-thread-comments/:threadId", zValidator("query", getThreadCommentsSchema), async (ctx) => {
  const { threadId } = ctx.req.param()
  const query = ctx.req.query()
  
  const result = getThreadCommentsSchema.parse(query)
  
  try {
    const comments = await getThreadComments({
      threadId, ...result
    });
    return ctx.json(comments, 200);
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 400);
  }
})