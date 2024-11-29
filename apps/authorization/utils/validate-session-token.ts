import type { Session, SessionValidationResult } from '#lib/routes/create-session.ts';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { forumDB } from '#db/db.ts';
import { HTTPException } from 'hono/http-exception';
import { sha256 } from '@oslojs/crypto/sha2';

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(
    new TextEncoder().encode(token))
  );
  
  const row = await forumDB
  .selectFrom('users_session')
  .innerJoin('users', 'users.id', 'users_session.user_id')
  .select([
    'users_session.id',
    'users_session.user_id',
    'users_session.expires_at'
  ])
  .where('users_session.id', '=', sessionId)
  .executeTakeFirst();
  
  if (!row) {
    return { session: null };
  }
  
  const { id, user_id, expires_at } = row
  
  const session: Session = { id, user_id, expires_at };
  const expiresAt = new Date(session.expires_at);
  
  if (Date.now() >= expiresAt.getTime()) {
    const res = await forumDB
    .deleteFrom('users_session')
    .where('id', '=', session.id)
    .executeTakeFirstOrThrow();
    
    if (!res) {
      throw new HTTPException(401, { message: "Internal Server Error" })
    }
    
    return { session: null };
  }
  
  if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    
    await forumDB
    .updateTable('users_session')
    .set({ expires_at: session.expires_at })
    .where('id', '=', session.id)
    .execute();
  }
  
  return { session };
}