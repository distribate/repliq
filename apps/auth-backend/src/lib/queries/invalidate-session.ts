import { forumDB } from "../../shared/database/forum-db";
import { deleteSessionToken } from "../../utils/delete-session-token";
import { deleteSession } from "./delete-session";

export async function invalidateSession(token: string, sessionId: string) {
  const query = await forumDB
    .selectFrom("users_session")
    .select(forumDB.fn.countAll().as("count"))
    .where("session_id", "=", sessionId)
    .$castTo<{ count: number }>()
    .executeTakeFirstOrThrow();

  if (!query.count) {
    throw new Error("Session not found");
  }

  await deleteSessionToken(token);

  return await deleteSession(sessionId);
}