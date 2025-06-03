import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { deleteSessionToken } from "../utils/delete-session-token";
import type { Env } from "../types/env-type";
import { terminateAllSessions } from "../lib/queries/terminate-all-sessions";
import { terminateSession } from "../lib/queries/terminate-session";
import { DEFAULT_SESSION_EXPIRE } from "../shared/constants/session-expire";
import { validateUserRequest } from "../middlewares/validate-user-request";
import { throwError } from "@repo/lib/helpers/throw-error";
import { forumDB } from "../shared/database/forum-db";

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

export async function getCurrentSessionCreatedAt(currentSessionId: string) {
  return forumDB
    .selectFrom("users_session")
    .select("created_at")
    .where("session_id", "=", currentSessionId)
    .executeTakeFirstOrThrow();
}

export const terminateSessionRoute = new Hono<Env>()
  .use(validateUserRequest)
  .post("/terminate-session", zValidator("json", terminateSessionBodySchema), async (ctx) => {
    const { selectedSessionId, type } = terminateSessionBodySchema.parse(await ctx.req.json());

    const nickname = ctx.get("nickname")
    const currentSessionId = ctx.get("currentSessionId")
    const sessionToken = ctx.get("sessionToken")

    if (!nickname || !currentSessionId) {
      return ctx.json({ error: "Unauthorized" }, 401)
    }

    if ((currentSessionId !== selectedSessionId) || type === "all") {
      const currentSessionCreatedAt = await getCurrentSessionCreatedAt(currentSessionId)

      if (new Date().getTime() - new Date(currentSessionCreatedAt.created_at).getTime() < DEFAULT_SESSION_EXPIRE) {
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

          return ctx.json({ 
            status: "Success", 
            meta: { 
              is_current: selectedSessionId === currentSessionId 
            } 
          }, 200)
        case "all":
          // @ts-ignore
          const terminatedAllSessions = await terminateAllSessions(
            nickname as string, currentSessionId as string
          )

          await deleteSessionToken(terminatedAllSessions.map(session => session.token))

          if (!terminatedAllSessions) {
            return ctx.json({ error: "Sessions not terminated" }, 500)
          }

          return ctx.json({ status: "Success", meta: { is_current: false } }, 200)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });