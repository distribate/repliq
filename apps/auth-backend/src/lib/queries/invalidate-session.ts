import { forumDB } from "../../shared/database/forum-db";
import { deleteSession } from "./delete-session";

export async function invalidateSession(sessionId: string) {
  const query = await forumDB
    .selectFrom("users_session")
    .select(forumDB.fn.countAll().as("count"))
    .where("session_id", "=", sessionId)
    .$castTo<{ count: number }>()
    .executeTakeFirstOrThrow();

  if (!query.count) {
    throw new Error("Session not found");
  }

  return await deleteSession(sessionId);
}