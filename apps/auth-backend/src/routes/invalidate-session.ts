import { Hono } from "hono";
import { z } from "zod";
import { invalidateSession } from "../utils/invalidate-session.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "../helpers/throw-error.ts";

export const invalidateSessionBodySchema = z.object({
  sessionId: z.string().min(6),
});

export const invalidateSessionRoute = new Hono()
.post( "/invalidate-session", zValidator("json", invalidateSessionBodySchema), async (ctx) => {
  const body = await ctx.req.json()
  const result = invalidateSessionBodySchema.parse(body);

  let res;

  try {
    res = await invalidateSession(result.sessionId);
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500)
  }

  return ctx.json({ success: !!res }, 200);
});