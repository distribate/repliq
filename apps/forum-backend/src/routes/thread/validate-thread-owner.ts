import { forumDB } from "#shared/database/forum-db.ts"

export async function validateThreadOwner(nickname: string, threadId: string) {
  const threadOwner = await forumDB
    .selectFrom("threads_users")
    .select(["user_nickname"])
    .where("thread_id", "=", threadId)
    .where("user_nickname", "=", nickname)
    .executeTakeFirst()

  if (!threadOwner || !threadOwner.user_nickname) {
    return false
  }

  return threadOwner.user_nickname === nickname
}