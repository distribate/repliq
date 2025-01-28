import { forumDB } from "../../shared/database/forum-db";

export async function terminateSession(sessionId: string) {
  return await forumDB
    .deleteFrom("users_session")
    .where("session_id", "=", sessionId)
    .executeTakeFirstOrThrow();
}