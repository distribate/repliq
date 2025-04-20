import { forumDB } from "../../shared/database/forum-db";

export async function getUserSession(sessionId: string) {
  return forumDB
    .selectFrom("users_session")
    .select("nickname")
    .where("session_id", "=", sessionId)
    .executeTakeFirst();
}