import { forumDB } from "#shared/database/forum-db.ts"

export async function validateThreadOwner(nickname: string, threadId: string) {
  const query = await forumDB
    .selectFrom("threads_users")
    .select(["nickname"])
    .where("thread_id", "=", threadId)
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  if (!query || !query.nickname) {
    return false
  }

  return query.nickname === nickname
}