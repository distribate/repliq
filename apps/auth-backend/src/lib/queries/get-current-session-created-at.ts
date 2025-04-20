import { forumDB } from "../../shared/database/forum-db";

export async function getCurrentSessionCreatedAt(currentSessionId: string) {
  return forumDB
    .selectFrom("users_session")
    .select("created_at")
    .where("session_id", "=", currentSessionId)
    .executeTakeFirstOrThrow();
}