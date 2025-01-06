import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserThreadsCount(nickname: string) {
  const query = await forumDB
    .selectFrom("threads_users")
    .select(forumDB.fn.countAll().as('count'))
    .$narrowType<{ count: number }>()
    .where("user_nickname", "=", nickname)
    .executeTakeFirst()

  if (!query) {
    return 0
  }

  return query.count
}