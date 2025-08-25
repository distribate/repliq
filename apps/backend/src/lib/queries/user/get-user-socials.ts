import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserSocials(nickname: string) {
  return forumDB
    .selectFrom("users_connections")
    .select(["type", "value", "created_at"])
    .where("nickname", "=", nickname)
    .execute()
}