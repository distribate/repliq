import { FRIENDS_PINNED_LIMIT } from "#shared/constants/user-limits.ts"
import { forumDB } from "#shared/database/forum-db.ts"

export async function validatePinnedFriendsLength(nickname: string) {
  const exists = await forumDB
    .selectFrom("friends_pinned")
    .select("id")
    .where("initiator", "=", nickname)
    .execute()

  return exists.length < FRIENDS_PINNED_LIMIT
}