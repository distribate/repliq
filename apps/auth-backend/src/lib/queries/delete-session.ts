import { forumDB } from "../../shared/database/forum-db";

export const deleteSession = async (sessionId: string) => {
  return await forumDB
  .deleteFrom("users_session")
  .where("session_id", "=", sessionId)
  .executeTakeFirstOrThrow();
}