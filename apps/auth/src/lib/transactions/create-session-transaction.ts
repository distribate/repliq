import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { getRedisClient } from "../../shared/redis/index.ts";
import { 
  destroySession, 
  generateSessionToken, 
  MAX_SESSIONS, 
  nicknameKey, 
  SESSION_TTL, 
  sessionIdKey, 
  sessionKey, 
  userSessionsKey, 
  type Session
} from "../../utils/auth.ts";

type CreateSession = {
  nickname: string
} & {
  ip: string;
  ua: string;
  browser: string | undefined;
  cpu: string | undefined;
  device: string | undefined;
  os: string | undefined;
}

export async function createSession(
  { nickname, browser, ip, cpu, os, ua, device }: CreateSession
) {
  const redis = getRedisClient()
  const now = Date.now();
  const token = generateSessionToken();

  const session_id = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

  const payload: Session = {
    browser: browser ?? "Unknown",
    ip,
    cpu: cpu ?? "Unknown",
    device: device ?? "Unknown",
    os: os ?? "Unknown",
    ua: ua ?? "Unknown",
    session_id,
    nickname,
    token,
    expires_at: SESSION_TTL,
    created_at: now,
    last_refreshed_at: now,
  };

  const userKey = userSessionsKey(nickname);
  const sessionList = await redis.lrange(userKey, 0, -1);

  if (sessionList.length >= MAX_SESSIONS) {
    const oldestToken = sessionList[sessionList.length - 1];

    await destroySession(oldestToken);
    await redis.rpop(userKey);
  }

  await redis.set(sessionKey(token), JSON.stringify(payload), "EX", SESSION_TTL);
  await redis.set(nicknameKey(token), nickname, "EX", SESSION_TTL);
  await redis.set(sessionIdKey(session_id), token, "EX", SESSION_TTL);
  await redis.lpush(userKey, token);

  return {
    ip,
    token,
    expires_at: new Date(Date.now() + SESSION_TTL * 1000),
    nickname
  }
}