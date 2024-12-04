import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const terminateSessionBodySchema = z.object({
  sessionId: z.string().min(6),
});

export const terminateSession = new Hono().post(
  "/terminate-session",
  zValidator("json", terminateSessionBodySchema),
  async (c) => {
    const result = terminateSessionBodySchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: "Invalid body" }, 400);
    }

    const body = result.data;
  },
);
