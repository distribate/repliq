import { Hono } from "hono";
import { z } from "zod";
import { validateSessionToken } from "#utils/validate-session-token.ts";
import { zValidator } from "@hono/zod-validator";

export const validateSessionBodySchema = z.object({
  token: z.string().min(6),
});

export const validateSessionRoute = new Hono().post(
  "/validate-session",
  zValidator("json", validateSessionBodySchema),
  async (c) => {
    const result = validateSessionBodySchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: "Invalid body" }, 400);
    }

    const body = result.data;

    const { token } = body;
    const { session, user } = await validateSessionToken(token);

    return c.json({ session, user }, 200);
  },
);
