import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { getCookie } from "hono/cookie";
import { getUserSession } from "#lib/queries/user/get-user-session.ts";
import { createMiddleware } from "hono/factory";

export const validateRequest = createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, "session")
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
  const session = await getUserSession(sessionId)

  if (!session) {
    return ctx.json({ error: "Unauthorized" }, 401)
  }

  const { nickname } = session

  ctx.set('nickname', nickname)
  await next()
})