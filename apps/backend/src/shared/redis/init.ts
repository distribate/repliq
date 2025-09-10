import Redis from 'ioredis';
import { isProduction, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USER } from '#shared/env/index.ts';

let redis: Redis | null = null;

export function initRedis() {
  if (redis) return;

  redis = new Redis({
    host: isProduction ? REDIS_HOST : "localhost",
    port: Number(REDIS_PORT),
    password: REDIS_PASSWORD,
    username: REDIS_USER
  });

  redis.on("connect", () => {
    console.log("\x1B[35m[Redis]\x1B[0m Client is connected");
  });

  redis.on("error", (err) => {
    console.error("\x1B[35m[Redis]\x1B[0m Connection error:", err);
  });

  redis.on("ready", () => {
    console.log("\x1B[35m[Redis]\x1B[0m Client is ready to use");
  });
}

export const getRedisClient = (): Redis => {
  if (!redis) {
    throw new Error('\x1B[35m[Redis]\x1B[0m Client is not initialized');
  }
  return redis;
}