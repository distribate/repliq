import { DEFAULT_MAX_POSTS_PER_DAY, MAX_POSTS_PER_MINUTE } from "#shared/constants/user-limitations.ts";
import { forumDB } from "#shared/database/forum-db.ts";

export async function validatePostsTimeout(nickname: string): Promise<"timeout" | null> {
  const now = new Date();

  const startOfDayUTC = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
  );

  const oneMinuteAgoUTC = new Date(now.getTime() - 60 * 1000);

  const result = await forumDB
    .selectFrom("posts_users")
    .select([
      forumDB.fn
        .countAll()
        // @ts-ignore
        .filterWhere("created_at", ">", oneMinuteAgoUTC.toISOString())
        .as("postsPerMinute"),
      forumDB.fn
        .countAll()
        // @ts-ignore
        .filterWhere("created_at", ">", startOfDayUTC.toISOString())
        .as("postsPerDay"),
    ])
    .where("nickname", "=", nickname)
    .$narrowType<{ postsPerMinute: number; postsPerDay: number }>()
    .executeTakeFirstOrThrow();

  const { postsPerMinute, postsPerDay } = result

  if (postsPerMinute >= MAX_POSTS_PER_MINUTE || postsPerDay >= DEFAULT_MAX_POSTS_PER_DAY) {
    return "timeout";
  }

  return null;
}