import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import type { Env } from "../types/env-type";
import { authMiddleware, listSessions } from "../utils/auth";

export const getSessionsRoute = new Hono<Env>()
  .use(authMiddleware())
  .get('/get-sessions', async (ctx) => {
    const currentSessionId = ctx.get('currentSessionId')

    if (!currentSessionId) {
      return ctx.json({ error: 'Unauthorized' }, 401);
    }

    try {
      const rawSessions = await listSessions(currentSessionId)

      if (!rawSessions) {
        return ctx.json({ data: [] }, 200)
      }

      const sessions = rawSessions.map(session => {
        return {
          ...session,
          is_current: session.session_id === currentSessionId,
          location: null
        }
      })

      return ctx.json({ data: sessions }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })