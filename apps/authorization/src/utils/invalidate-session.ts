import { forumDB } from '#lib/db/db.ts';

export async function invalidateSession(sessionId: string) {
  return await forumDB
  .deleteFrom("users_session")
  .where('session_id', '=', sessionId)
  .executeTakeFirstOrThrow();
}