import { Hono } from 'hono';
import { z } from 'zod';
import { invalidateSession } from '#utils/invalidate-session.ts';
import { zValidator } from '@hono/zod-validator'

export const invalidateSessionBodySchema = z.object({
  sessionId: z.string().min(6)
})

export const app = new Hono()
.post("/invalidate-session", zValidator("json", invalidateSessionBodySchema, async (result, c) => {
  if (!result.success) {
    return c.text('Invalid body', 400)
  }
  
  const body = await c.req.json<z.infer<typeof invalidateSessionBodySchema>>();
  const res = await invalidateSession(body.sessionId)
  
  return c.json({ success: !!res }, 200)
}))