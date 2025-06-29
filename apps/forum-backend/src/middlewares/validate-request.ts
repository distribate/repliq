import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getUserNicknameByTokenFromKv } from "#utils/get-user-by-token-from-kv.ts";
import { logger } from "@repo/lib/utils/logger";

export const SESSION_KEY = "forum_session"

export const validateRequest = (type: "prevent" | undefined = undefined) => createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, SESSION_KEY)
  
  if (type === "prevent") {
    if (!sessionToken) {
      return ctx.json({ error: "Unauthorized" }, 401)
    }
  }

  const nickname = await getUserNicknameByTokenFromKv(sessionToken)

  if (type === "prevent") {
    if (!nickname) {
      return ctx.json({ error: "Unauthrozied" }, 401)
    }
  }

  ctx.set('nickname', nickname);

  if (type === "prevent") {
    if (!ctx.get("nickname")) {
      return ctx.json({ error: "Failed to validate request" }, 401)
    }
  }

  await next()
})