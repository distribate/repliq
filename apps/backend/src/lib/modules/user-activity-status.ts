import { getRedisClient } from "#shared/redis/index.ts";

export type ActivityStatusPayload = number;

const ACTIVITY_MAX_TTL = 6 * 30 * 24 * 60 * 60; // seconds
export const ONLINE_USERS_TIME = 5 * 60 * 1000; // 5 minutes in ms

export const getLastActivityNicknameKey = (nickname: string) => `users:last_activity:${nickname}`
export const getLastActivityZsetKey = `users:last_activity_zset`
export const getPresenceKey = (nickname: string) => `users:presence:${nickname}`

export async function getUserActivityStatus(nickname: string): Promise<number | null> {
  const redis = getRedisClient();
  const key = getLastActivityNicknameKey(nickname);
  const payload = await redis.get(key);
  if (!payload) return null;

  const n = Number(payload);
  return Number.isNaN(n) ? null : n;
}

export async function updateUserActivityStatus(nickname: string): Promise<void> {
  const redis = getRedisClient();
  const now: ActivityStatusPayload = Date.now();

  await redis.zadd(getLastActivityZsetKey, now, nickname);
  await redis.set(getLastActivityNicknameKey(nickname), now, 'EX', ACTIVITY_MAX_TTL);
  await redis.set(getPresenceKey(nickname), '1', 'PX', ONLINE_USERS_TIME);
}

export async function cleanupOldEntries() {
  const redis = getRedisClient();
  const now: ActivityStatusPayload = Date.now();
  const expiredScore = now - ONLINE_USERS_TIME

  try {
    const removed = await redis.zremrangebyscore(getLastActivityZsetKey, 0, expiredScore);

    console.log(`[cleanup-old-activity-entries]: ${removed} records have been removed`);
  } catch (error) {
    console.error("[cleanup-old-activity-entries]: Error while cleaning out obsolete records:", error);
  }
}