import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { throwError } from '#helpers/throw-error.ts';
import { getUserThreads } from '#lib/queries/user/get-user-threads.ts';

export const getUserThreadsSchema = z.object({
  querySearch: z.string().optional()
})

export const getUserThreadsRoute = new Hono()
.get("/get-user-threads/:nickname", zValidator("query", getUserThreadsSchema), async (ctx) => {
  const { nickname } = ctx.req.param();
  const { querySearch } = getUserThreadsSchema.parse(ctx.req.query())
  
  let threads;
  
  try {
    threads = await getUserThreads({ nickname, querySearch });
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);
  }
  
  return ctx.json(threads, 200);
});