import { forumDB } from "../../shared/database/forum-db";

export async function getSessions(nickname: string) {
  return await forumDB
    .selectFrom('users_session')
    .select(["browser", "os", "session_id", "location", "created_at"])
    .where('nickname', '=', nickname)
    .orderBy('created_at', 'desc')
    .execute();
}