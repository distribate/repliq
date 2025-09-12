import Redis from 'ioredis';
import {
  isProduction,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USER
} from '../env';

let redis: Redis

export async function startRedis() {
  if (redis) return;

  redis = new Redis({
    host: isProduction ? REDIS_HOST : "127.0.0.1",
    port: Number(REDIS_PORT),
    password: REDIS_PASSWORD,
    username: REDIS_USER,
    lazyConnect: true
  });

  redis.on("connect", () => {
    console.log("\x1B[35m[Redis]\x1B[0m Connected");
  });

  redis.on("error", (err) => {
    console.error("\x1B[35m[Redis]\x1B[0m Connection error:", err);
  });

  redis.on("ready", () => {
    console.log("\x1B[35m[Redis]\x1B[0m Ready to use");
  });

  await redis.connect()

  console.log("\x1B[35m[Redis]\x1B[0m Start complete");
}

export const getRedisClient = (): Redis => {
  if (!redis) throw new Error('\x1B[35m[Redis]\x1B[0m Client is not initialized');
  return redis;
}