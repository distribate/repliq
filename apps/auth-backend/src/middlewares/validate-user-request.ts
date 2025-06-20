import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { forumDB } from "../shared/database/forum-db";

export async function getUserSession(sessionId: string) {
  return forumDB
    .selectFrom("users_session")
    .select("nickname")
    .where("session_id", "=", sessionId)
    .executeTakeFirst();
}

export const validateUserRequest = createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, "session")
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(sessionToken))
  );
  
  const session = await getUserSession(sessionId)

  if (!session) {
    return ctx.json({ error: "Unauthorized" }, 200)
  }

  ctx.set('sessionToken', sessionToken)
  ctx.set('currentSessionId', sessionId)
  ctx.set('nickname', session.nickname)

  await next()
})