import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const terminateSessionBodySchema = z.object({
  sessionId: z.string().min(6),
});

export const terminateSession = new Hono()
.post("/terminate-session",zValidator("json", terminateSessionBodySchema), async (ctx) => {
  const body = await ctx.req.json()
  const result = terminateSessionBodySchema.parse(body);

  // implement the terminating session logic
});