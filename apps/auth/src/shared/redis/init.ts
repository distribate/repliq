import Redis from 'ioredis';
import {
  isProduction,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USER
} from '../env';

let redis: Redis | null = null;

const connect = new Redis({
  host: isProduction ? REDIS_HOST : "127.0.0.1",
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
  username: REDIS_USER
});

export const getRedisClient = (): Redis => {
  if (!redis) throw new Error('\x1B[35m[Redis]\x1B[0m Client is not initialized');
  return redis;
}

export function initRedis() {
  try {
    redis = connect
    console.log("\x1B[35m[Redis]\x1B[0m Client is connected")
  } catch (e) {
    console.error(`\x1B[35m[Redis]\x1B[0m`, e)
  }
}