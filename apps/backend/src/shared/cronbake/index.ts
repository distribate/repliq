import Baker, { RedisPersistenceProvider } from "cronbake";
import { startJobs } from "./jobs";
import { getRedisClient } from "../redis";

let baker: Baker;

function initBaker() {
  const redis = getRedisClient();

  if (!redis) {
    throw new Error("\x1B[35m[Baker]\x1B[0m Redis is not defined")
  }

  const provider = new RedisPersistenceProvider({
    client: redis,
    key: 'cronbake:state'
  });

  baker = Baker.create({
    persistence: {
      enabled: true,
      strategy: 'redis',
      provider,
      autoRestore: true
    },
  });

  console.log("\x1B[35m[Baker]\x1B[0m Client created")
}

export async function startBaker() {
  initBaker()
  await startJobs()
}

export function getBaker() {
  if (!baker) throw new Error("\x1B[35m[Baker]\x1B[0m Not initialized");
  return baker;
}