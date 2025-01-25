import { forumDB } from "#shared/database/forum-db.ts"

export async function validateThreadOwner(nickname: string, threadId: string) {
  const query = await forumDB
    .selectFrom("threads_users")
    .select(["user_nickname"])
    .where("thread_id", "=", threadId)
    .where("user_nickname", "=", nickname)
    .executeTakeFirst()

  if (!query || !query.user_nickname) {
    return false
  }

  return query.user_nickname === nickname
}