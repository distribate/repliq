import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import type { Env } from "../types/env-type";
import { validateUserRequest } from "../middlewares/validate-user-request";
import { getSessions } from "../lib/queries/get-sessions";

export const getSessionsRoute = new Hono<Env>()
  .use(validateUserRequest)
  .get('/get-sessions', async (ctx) => {
    const nickname = ctx.get("nickname")
    const currentSessionId = ctx.get('currentSessionId')

    if (!nickname || !currentSessionId) {
      return ctx.json({ error: 'Unauthorized' }, 401);
    }

    try {
      const rawSessions = await getSessions(nickname)

      if (!rawSessions) {
        return ctx.json({ data: [] }, 200)
      }

      const sessions = rawSessions.map(session => {
        return {
          ...session,
          is_current: session.session_id === currentSessionId
        }
      })

      return ctx.json({ data: sessions }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })