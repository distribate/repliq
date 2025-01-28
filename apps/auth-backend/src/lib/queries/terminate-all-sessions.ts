import { forumDB } from "../../shared/database/forum-db";

export async function terminateAllSessions(nickname: string, currentSessionId: string) {
  return await forumDB
    .deleteFrom("users_session")
    .where("nickname", "=", nickname)
    .where("session_id", "!=", currentSessionId)
    .returning("token")
    .execute();
}