import { forumDB } from "../../shared/database/forum-db";

export async function getUserSession(sessionId: string) {
  return await forumDB
    .selectFrom("users_session")
    .select("nickname")
    .where("session_id", "=", sessionId)
    .executeTakeFirst();
}