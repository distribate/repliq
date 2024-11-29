import { Hono } from 'hono';
import { z } from 'zod';
import { validateSessionToken } from '#utils/validate-session-token.ts';
import { zValidator } from '@hono/zod-validator'

export const validateSessionBodySchema = z.object({
  token: z.string().min(6)
})

const app = new Hono()
.post("/validate-session", zValidator("json", validateSessionBodySchema, async (result, c) => {
  if (!result.success) {
    return c.text('Invalid body', 400)
  }
  
  const body = await c.req.json<z.infer<typeof validateSessionBodySchema>>()
  
  const { token } = body;
  const { session } = await validateSessionToken(token);
  
  return c.json({ session }, 200)
}))

export { app };