import { Hono } from 'hono';
import { getThreadComments } from '#lib/queries/get-thread-comments.ts';
import { throwError } from '#helpers/throw-error.ts';
import { zValidator } from '@hono/zod-validator';
import { getThreadCommentsSchema } from '@repo/types/schemas/thread/get-thread-comments-schema.ts';


export const getThreadCommentsRoute = new Hono()
.get("/get-thread-comments/:threadId", zValidator("query", getThreadCommentsSchema), async (ctx) => {
  const { threadId } = ctx.req.param()
  const query = ctx.req.query()
  
  const result = getThreadCommentsSchema.parse(query)
  
  let comments;
  
  try {
    comments = await getThreadComments({
      threadId, ...result
    });
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 400);
  }
  
  return ctx.json(comments, 200);
})