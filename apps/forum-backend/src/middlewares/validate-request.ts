import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getUserNicknameByTokenFromKv } from "#utils/get-user-by-token-from-kv.ts";

export const validateRequest = createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, "session")

  if (!sessionToken) {
    return ctx.json({ error: "Unauthorized" }, 401)
  }

  const nickname = await getUserNicknameByTokenFromKv(sessionToken)

  if (!nickname) {
    return ctx.json({ error: "Unauthrozied" }, 401)
  }

  ctx.set('nickname', nickname);

  if (!ctx.get("nickname")) {
    return ctx.json({ error: "Failed to validate request" }, 401)
  }

  await next()
})