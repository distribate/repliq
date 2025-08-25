import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getRedisClient } from "#shared/redis/init.ts";

export const SESSION_KEY = "forum_session"

export function nicknameKey(token: string) {
  return `session:${token}:nickname`;
}

export async function getNickname(token: string): Promise<string | null> {
  const redis = getRedisClient()
  return redis.get(nicknameKey(token));
}

export const validateRequest = (
  type: "prevent" | undefined = undefined
) => createMiddleware(async (ctx, next) => {
  const sessionToken = getCookie(ctx, SESSION_KEY)
  
  if (type === "prevent") {
    if (!sessionToken) {
      return ctx.json({ error: "Unauthorized" }, 401)
    }
  }

  // @ts-expect-error
  const nickname = await getNickname(sessionToken)

  if (type === "prevent") {
    if (!nickname) {
      return ctx.json({ error: "Unauthrozied" }, 401)
    }
  }

  ctx.set('nickname', nickname ?? null);

  if (type === "prevent") {
    if (!ctx.get("nickname")) {
      return ctx.json({ error: "Failed to validate request" }, 401)
    }
  }

  await next()
})