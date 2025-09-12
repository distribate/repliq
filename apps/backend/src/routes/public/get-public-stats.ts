import { STATS_CACHE_PARENT_KEY } from "#shared/constants/keys.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getRedisClient } from "#shared/redis/index.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

const PUBLIC_STATS_KEY = `${STATS_CACHE_PARENT_KEY}:public-global`

type PublicStatsPayload = {
  threads_count: number;
  users_count: number;
  posts_count: number;
}

export async function updatePublicState() {
  const redis = getRedisClient()

  const [threads, users, posts] = await Promise.all([
    forumDB
      .selectFrom("threads")
      .select(eb => eb.fn.countAll("threads").as("count"))
      .executeTakeFirst(),
    forumDB
      .selectFrom("users")
      .select(eb => eb.fn.countAll("users").as("count"))
      .executeTakeFirst(),
    forumDB
      .selectFrom("posts")
      .select(eb => eb.fn.countAll("posts").as("count"))
      .executeTakeFirst()
  ])

  const payload: PublicStatsPayload = {
    threads_count: Number(threads?.count ?? 0),
    users_count: Number(users?.count ?? 0),
    posts_count: Number(posts?.count ?? 0)
  }

  await redis.set(PUBLIC_STATS_KEY, JSON.stringify(payload))
}

const init: PublicStatsPayload = {
  users_count: 0,
  threads_count: 0,
  posts_count: 0
}

async function getPublicStatsFromCache(): Promise<PublicStatsPayload> {
  const redis = getRedisClient()

  const payload = await redis.get(PUBLIC_STATS_KEY)
  if (!payload) return init

  const data: PublicStatsPayload = JSON.parse(payload)
  return data
}

export const getPublicStatsRoute = new Hono()
  .get("/public-stats", async (ctx) => {
    try {
      const data = await getPublicStatsFromCache()

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })