import { Hono } from 'hono';
import { z } from 'zod';
import { invalidateSession } from '#utils/invalidate-session.ts';
import { zValidator } from '@hono/zod-validator'

export const invalidateSessionBodySchema = z.object({
  sessionId: z.string().min(6)
})

export const invalidateSessionRoute = new Hono()
.post('/invalidate-session', zValidator('json', invalidateSessionBodySchema), async(c) => {
  const result = invalidateSessionBodySchema.safeParse(await c.req.json());
  
  if (!result.success) {
    return c.json({ error: 'Invalid body' }, 400);
  }
  
  const body = await c.req.json<z.infer<typeof invalidateSessionBodySchema>>();
  const res = await invalidateSession(body.sessionId);
  
  return c.json({ success: !!res }, 200);
})