import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserFriendPreference(nickname: string): Promise<boolean> {
  const query = await forumDB
    .selectFrom('users_settings')
    .select("accept_friend_request")
    .where('nickname', '=', nickname)
    .executeTakeFirstOrThrow();

  return query.accept_friend_request
}