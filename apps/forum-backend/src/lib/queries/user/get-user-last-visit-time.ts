import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserLastVisitTime(nickname: string) {
  return await forumDB
    .selectFrom("users_game_status")
    .select(["quited", "joined"])
    .where("nickname", "=", nickname)
    .executeTakeFirst()
}