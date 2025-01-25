import { Hono } from "hono";
import { z } from "zod";
import { validateSessionToken } from "../utils/validate-session-token.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { putSessionToken } from "../utils/put-session-token.ts";

export const validateSessionBodySchema = z.object({
  token: z.string().min(6),
});

export const validateSessionRoute = new Hono()
  .post("/validate-session", zValidator("json", validateSessionBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const { token } = validateSessionBodySchema.parse(body)

    try {
      const { session, user } = await validateSessionToken(token);

      if (!user || !session) {
        return ctx.json({ error: "Invalid session token" }, 401)
      }

      await putSessionToken(user.nickname, token)

      return ctx.json({ session, user }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }
);