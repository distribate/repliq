import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserFriendPreference(nickname: string): Promise<boolean> {
  const { accept_friend_request } = await forumDB
    .selectFrom("users_settings")
    .select("accept_friend_request")
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow();

  return accept_friend_request;
}