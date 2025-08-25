import { FRIENDS_LIMIT } from "#shared/constants/user-limits.ts";
import { forumDB } from "#shared/database/forum-db.ts";

export async function validateFriendsLength(nickname: string) {
  const query = await forumDB
    .selectFrom("users_friends")
    .select("id")
    .where((qb) =>
      qb.or([
        qb("user_1", "=", nickname),
        qb("user_2", "=", nickname)
      ])
    )
    .execute()
  
  if (!query) return true;

  if (query.length >= FRIENDS_LIMIT) {
    return false
  }

  return true
}