import { getLastActivityZsetKey } from "#lib/modules/user-activity-status.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getRedisClient } from "#shared/redis/init.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

const ONLINE_USERS_TIME = 5 * 60 * 1000
const DEFAULT_LIMIT = 7

type OnlineUser = { 
  nickname: string, 
  avatar: string | null 
}

export async function getOnlineUsers(): Promise<OnlineUser[]> {
  const redis = getRedisClient();
  const now = Date.now();
  const minScore = now - ONLINE_USERS_TIME;

  const onlineNicknames = await redis.zrangebyscore(
    getLastActivityZsetKey,
    minScore,
    '+inf',         
    'LIMIT', 0, DEFAULT_LIMIT
  );

  if (onlineNicknames.length === 0) return [];

  const users = await forumDB
    .selectFrom("users")
    .select(["nickname", "avatar"])
    .where("nickname", "in", onlineNicknames)
    .execute();

  const nicknameIdx = Object.fromEntries(onlineNicknames.map((n, i) => [n, i]));

  users.sort((a, b) => nicknameIdx[a.nickname] - nicknameIdx[b.nickname]);

  return users;
}

export const getOnlineUsersRoute = new Hono()
  .get("/online-users", async (ctx) => {
    try {
      const data = await getOnlineUsers();

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })