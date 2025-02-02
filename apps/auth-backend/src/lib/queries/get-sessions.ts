import { forumDB } from "../../shared/database/forum-db";

export async function getSessions(nickname: string) {
  return await forumDB
    .selectFrom('users_session')
    .select(["browser", "os", "ip", "session_id"])
    .where('nickname', '=', nickname)
    .orderBy('created_at', 'desc')
    .execute();
}