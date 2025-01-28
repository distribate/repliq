import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getCookie } from "hono/cookie";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { createMiddleware } from "hono/factory";
import { deleteSessionToken } from "../utils/delete-session-token";
import type { Env } from "../types/env-type";
import { getUserSession } from "../lib/queries/get-user-session";
import { terminateAllSessions } from "../lib/queries/terminate-all-sessions";
import { terminateSession } from "../lib/queries/terminate-session";
import { getCurrentSessionCreatedAt } from "../lib/queries/get-current-session-created-at";
import { DEFAULT_SESSION_EXPIRE } from "../shared/constants/session-expire";

const terminateSessionBodySchema = z.object({
  selectedSessionId: z.string().min(6).optional(),
  type: z.enum(["single", "all"])
}).refine(
  (data) => (data.type === "single" && !!data.selectedSessionId) || (data.type === "all" && !data.selectedSessionId),
  {
    message: "selectedSessionId must be provided for 'single' and must be undefined for 'all'",
    path: ["selectedSessionId"],
  }
);

export const validateUserRequest = createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, "session")
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
  const session = await getUserSession(sessionId)

  if (!session) {
    return ctx.json({ error: "Unauthorized" }, 401)
  }

  const { nickname } = session

  ctx.set('sessionToken', sessionToken)
  ctx.set('currentSessionId', sessionId)
  ctx.set('nickname', nickname)

  await next()
})

export const terminateSessionRoute = new Hono<Env>()
  .use(validateUserRequest)
  .post("/terminate-session", zValidator("json", terminateSessionBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const { selectedSessionId, type } = terminateSessionBodySchema.parse(body);

    const nickname = ctx.get("nickname")
    const currentSessionId = ctx.get("currentSessionId")
    const sessionToken = ctx.get("sessionToken")

    if (!nickname || !currentSessionId) {
      return ctx.json({ error: "Unauthorized" }, 401)
    }

    if ((currentSessionId !== selectedSessionId) || type === "all") {
      const currentSessionCreatedAt = await getCurrentSessionCreatedAt(currentSessionId)
      const now = new Date();

      if (now.getTime() - new Date(currentSessionCreatedAt.created_at).getTime() < DEFAULT_SESSION_EXPIRE) {
        return ctx.json({ error: "Session must be at least 3 days old" }, 401);
      }
    }

    try {
      switch (type) {
        case "single":
          if (!selectedSessionId) {
            return ctx.json({ error: "selectedSessionId must be provided" }, 400)
          }

          const [terminatedSession, _] = await Promise.all([
            terminateSession(selectedSessionId),
            deleteSessionToken(sessionToken as string)
          ])

          if (!terminatedSession) {
            return ctx.json({ error: "Session not terminated" }, 500)
          }

          return ctx.json({ status: "Success", meta: { is_current: selectedSessionId === currentSessionId } }, 200)
        case "all":
          // @ts-ignore
          const terminatedAllSessions = await terminateAllSessions(nickname as string, currentSessionId as string)

          await deleteSessionToken(terminatedAllSessions.map(session => session.token))

          if (!terminatedAllSessions) {
            return ctx.json({ error: "Sessions not terminated" }, 500)
          }

          return ctx.json({ status: "Success", meta: { is_current: false } }, 200)
      }
    } catch (e) {
      return ctx.json({ error: "Internal Server Error" }, 500)
    }
  });