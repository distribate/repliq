import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { SESSION_KEY } from "../shared/constants/session-details";
import { getRedisClient } from "../shared/redis";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import type { Context } from "hono";

export const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
const REFRESH_THRESHOLD = 60 * 60 * 24 * 15; // 15 days
export const MAX_SESSIONS = 16;

export type Session = {
  browser: string,
  nickname: string;
  created_at: number;
  last_refreshed_at: number;
  os: string,
  expires_at: number,
  session_id: string,
  ip: string,
  cpu: string,
  device: string,
  ua: string,
  token: string,
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export function sessionKey(token: string) {
  return `session:${token}`;
}

export function nicknameKey(token: string) {
  return `session:${token}:nickname`;
}

export function userSessionsKey(nickname: string) {
  return `user:${nickname}:sessions`;
}

export function sessionIdKey(sessionId: string) {
  return `sessid:${sessionId}`;
}

export async function listSessions(nickname: string): Promise<(Session & {
  created_at_date: Date;
  expires_at_date: Date;
  last_refreshed_at_date: Date;
})[]> {
  const redis = getRedisClient();

  const sessionIds = await redis.lrange(`user:${nickname}:sessions`, 0, -1);

  const result: (Session & {
    created_at_date: Date;
    expires_at_date: Date;
    last_refreshed_at_date: Date;
  })[] = [];

  for (const sessionId of sessionIds) {
    const token = await redis.get(`sessid:${sessionId}`);
    if (!token) continue;

    const raw = await redis.get(`sess:${token}`);
    if (!raw) continue;

    const session: Session = JSON.parse(raw);

    result.push({
      ...session,
      created_at_date: new Date(session.created_at),
      expires_at_date: new Date(session.expires_at),
      last_refreshed_at_date: new Date(session.last_refreshed_at),
    });
  }

  return result;
}

export async function getSession(token: string): Promise<Session | null> {
  const redis = getRedisClient();
  const data = await redis.get(sessionKey(token));
  if (!data) return null;

  const payload: Session = JSON.parse(data);
  const ttl = await redis.ttl(sessionKey(token));

  if (ttl > 0 && ttl < REFRESH_THRESHOLD) {
    const newTtl = ttl + REFRESH_THRESHOLD;
    payload.last_refreshed_at = Date.now();
    payload.expires_at = Date.now() + newTtl * 1000;

    await redis.set(sessionKey(token), JSON.stringify(payload), "EX", newTtl);
    await redis.expire(nicknameKey(token), newTtl);
    await redis.expire(sessionIdKey(payload.session_id), newTtl);
  }

  return payload;
}

export async function getNickname(token: string): Promise<string | null> {
  const redis = getRedisClient()
  return redis.get(nicknameKey(token));
}

export async function destroySession(token: string): Promise<void> {
  const redis = getRedisClient();
  const data = await redis.get(sessionKey(token));

  if (data) {
    const payload: Session = JSON.parse(data);
    await redis.lrem(userSessionsKey(payload.nickname), 0, payload.session_id);
    await redis.del(sessionIdKey(payload.session_id));
  }

  await redis.del(sessionKey(token), nicknameKey(token));
}

export async function destroyAllSessions(nickname: string): Promise<void> {
  const redis = getRedisClient();
  const sessionIds = await redis.lrange(userSessionsKey(nickname), 0, -1);

  for (const sessionId of sessionIds) {
    const token = await redis.get(sessionIdKey(sessionId));
    if (token) {
      await redis.del(sessionKey(token), nicknameKey(token));
    }
    await redis.del(sessionIdKey(sessionId));
  }

  await redis.del(userSessionsKey(nickname));
}

export async function conditionalLogout(currentSessionToken: string): Promise<boolean> {
  const redis = getRedisClient()

  const data = await redis.get(sessionKey(currentSessionToken));
  if (!data) return false;

  const payload: Session = JSON.parse(data);
  const threeDays = 1000 * 60 * 60 * 24 * 3;

  if (Date.now() - payload.created_at < threeDays) {
    return false;
  }

  const userKey = userSessionsKey(payload.nickname);
  const sessions = await redis.lrange(userKey, 0, -1);

  for (const sessionToken of sessions) {
    if (sessionToken === currentSessionToken) continue;

    await redis.del(sessionKey(sessionToken), nicknameKey(sessionToken));
    await redis.lrem(userKey, 0, sessionToken);
  }

  return true;
}

export const authMiddleware = () => createMiddleware(async (ctx, next) => {
  const token = getSessionToken(ctx)

  if (!token) {
    return ctx.json({ error: "Unauthorized: token is not defined" }, 401)
  }

  const session = await getSession(token);

  if (!session) {
    return ctx.json({ error: "Unauthorized: invalid or expired session" }, 401)
  }

  ctx.set("sessionToken", token)
  ctx.set("nickname", session.nickname)
  ctx.set("currentSessionId", session.session_id)

  await next()
})

export function getSessionToken(ctx: Context) {
  return getCookie(ctx, SESSION_KEY)
}