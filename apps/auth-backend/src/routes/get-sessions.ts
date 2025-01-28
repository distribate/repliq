import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { validateUserRequest } from "./terminate-session";
import { forumDB } from "../shared/database/forum-db";
import type { Env } from "../types/env-type";

async function getSessions(nickname: string) {
  return await forumDB
    .selectFrom('users_session')
    .select(["browser", "os", "ip", "session_id"])
    .where('nickname', '=', nickname)
    .orderBy('created_at', 'desc')
    .execute();
}

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