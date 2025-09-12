import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getRedisClient } from "#shared/redis/index.ts";
import { log } from "#utils/log.ts";

export const SESSION_KEY = "forum_session"

export function nicknameKey(token: string) {
  return `session:${token}:nickname`;
}

export async function getNickname(token?: string): Promise<string | null> {
  if (!token) return null;
  const redis = getRedisClient()
  return redis.get(nicknameKey(token));
}

type ValidateMode = "prevent" | undefined;

/**
* middleware factory that validates session cookie / nickname.
* - mode === "prevent" — require both cookie and nickname, otherwise 401
* - mode === undefined — optional: attach nickname (or null) to ctx
*/
export const requireAuth = (mode: ValidateMode = undefined) => createMiddleware(async (ctx, next) => {
  const sessionToken: string | undefined = getCookie(ctx, SESSION_KEY)
  
  if (mode === "prevent" && !sessionToken) {
    return ctx.json({ error: "Unauthorized" }, 401);
  }

  const nickname = await getNickname(sessionToken);
  
  if (mode === "prevent" && !nickname) {
    return ctx.json({ error: "Unauthorized" }, 401);
  }

  ctx.set("nickname", nickname);

  await next();
})