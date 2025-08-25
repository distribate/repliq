import { isProduction } from '#helpers/is-production.ts';
import Redis from 'ioredis';

let rc: Redis | null = null;

const redis = new Redis({
  host: isProduction ? Bun.env.REDIS_HOST : "localhost",
  port: Number(Bun.env.REDIS_PORT),
  password: Bun.env.REDIS_USER_PASSWORD,
  username: Bun.env.REDIS_USER
});

export const getRedisClient = (): Redis => {
  if (!rc) throw new Error('Redis client is not initialized');
  return rc;
}

export function initRedis() {
  try {
    rc = redis
    console.log("Redis client is connected")
  } catch (e) {
    console.error(`Redis`, e)
  }
}