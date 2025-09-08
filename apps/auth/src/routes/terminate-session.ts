import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../types/env-type";
import { throwError } from "#utils/throw-error.ts";
import { authMiddleware, conditionalLogout, destroySession } from "../utils/auth";

const terminateSessionBodySchema = z.object({
  selectedSessionId: z.string().min(6).optional(),
  type: z.enum(["single", "all"])
}).refine((data) => (data.type === "single" && !!data.selectedSessionId) || (data.type === "all" && !data.selectedSessionId),
  {
    error: "selectedSessionId must be provided for 'single' and must be undefined for 'all'",
    path: ["selectedSessionId"],
  }
);

export const terminateSessionRoute = new Hono<Env>()
  .use(authMiddleware())
  .post("/terminate-session", zValidator("json", terminateSessionBodySchema), async (ctx) => {
    const { selectedSessionId, type } = terminateSessionBodySchema.parse(await ctx.req.json());

    const currentSessionId = ctx.get("currentSessionId")
    const sessionToken = ctx.get("sessionToken")

    const isIdentity = currentSessionId !== selectedSessionId;

    try {
      if (isIdentity || type === "all") {
        const result = await conditionalLogout(sessionToken)

        if (!result) {
          return ctx.json({ error: "It's too early for this action" }, 400)
        }

        return ctx.json({
          status: "Success",
          meta: { is_current: false }
        }, 200)
      }

      if (type === 'single') {
        if (!selectedSessionId) {
          return ctx.json({ error: "selectedSessionId must be provided" }, 400)
        }

        const selectedSessionToken = "";

        const [terminatedSession] = await Promise.all([
          destroySession(selectedSessionToken),
          // deleteSessionToken(sessionToken as string)
        ])

        return ctx.json({
          status: "Success",
          meta: {
            is_current: selectedSessionId === currentSessionId
          }
        }, 200)
      }

      return ctx.json({ error: "Invalid input" }, 400)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });