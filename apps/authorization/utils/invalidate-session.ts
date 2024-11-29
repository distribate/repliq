import { forumDB } from '#db/db.ts';

export async function invalidateSession(sessionId: string) {
  return await forumDB
  .deleteFrom("users_session")
  .where('id', '=', sessionId)
  .executeTakeFirstOrThrow();
}