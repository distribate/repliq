import { DEFAULT_MAX_THREADS_PER_DAY } from "#shared/constants/user-limits.ts";
import { forumDB } from "#shared/database/forum-db.ts";

export async function validateThreadsTimeout(nickname: string) {
  const threeDayAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const result = await forumDB
    .selectFrom("threads_users")
    .select([
      forumDB.fn
        .countAll()
        .as("postsPerThreeDay"),
    ])
    // @ts-expect-error
    .where("created_at", ">", threeDayAgo.toISOString())
    .where("nickname", "=", nickname)
    .$narrowType<{ postsPerThreeDay: number }>()
    .executeTakeFirstOrThrow();

  const { postsPerThreeDay } = result

  if (postsPerThreeDay >= DEFAULT_MAX_THREADS_PER_DAY) {
    return "timeout"
  }

  return null
}