import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getUserSession } from "../lib/queries/get-user-session";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

export const validateUserRequest = createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, "session")
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
  
  const session = await getUserSession(sessionId)

  if (!session) {
    return ctx.json({ error: "Unauthorized" }, 200)
  }

  ctx.set('sessionToken', sessionToken)
  ctx.set('currentSessionId', sessionId)
  ctx.set('nickname', session.nickname)

  await next()
})