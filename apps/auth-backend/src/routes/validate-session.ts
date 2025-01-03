import { Hono } from "hono";
import { z } from "zod";
import { validateSessionToken } from "../utils/validate-session-token.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "../helpers/throw-error.ts";

export const validateSessionBodySchema = z.object({
  token: z.string().min(6),
});

export const validateSessionRoute = new Hono()
  .post("/validate-session", zValidator("json", validateSessionBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = validateSessionBodySchema.parse(body)

    const { token } = result;

    let validated = null;

    try {
      const { session, user } = await validateSessionToken(token);

      validated = { session, user }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }

    return ctx.json(validated, 200)
  });