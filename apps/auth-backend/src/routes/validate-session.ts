import { Hono } from "hono";
import { z } from "zod";
import { validateSessionToken } from "../utils/validate-session-token.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from '@repo/lib/helpers/throw-error.ts';

export const validateSessionBodySchema = z.object({
  token: z.string().min(6),
});

export const validateSessionRoute = new Hono()
  .post("/validate-session", zValidator("json", validateSessionBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = validateSessionBodySchema.parse(body)

    const { token } = result;
    try {
      const { session, user } = await validateSessionToken(token);

      console.log(session, user)

      return ctx.json({ session, user }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }
);