import { Hono } from "hono";
import { z } from "zod";
import { validateSessionToken } from "../utils/validate-session-token.ts";
import { zValidator } from "@hono/zod-validator";

export const validateSessionBodySchema = z.object({
  token: z.string().min(6),
});

export const validateSessionRoute = new Hono()
.post("/validate-session", zValidator("json", validateSessionBodySchema), async (ctx) => {
  const body = await ctx.req.json()
  const result = validateSessionBodySchema.parse(body)

  const { token } = result;
  const { session, user } = await validateSessionToken(token);

  return ctx.json({ session, user }, 200);
});