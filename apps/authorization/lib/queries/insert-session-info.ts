import type { Session } from '#lib/routes/create-session.ts';
import type { Transaction } from 'kysely';
import type { DB } from '#types/db/forum-database-types.ts';

export type SessionInfo = Pick<Session, 'browser' | 'cpu' | 'ip' | 'isBot' | 'os' | 'ua' | "id">

type InsertSessionInfo = {
  trx: Transaction<DB>,
  details: SessionInfo
}

export async function insertSessionInfo({
  trx, details
}: InsertSessionInfo) {
  const { id: sessionId, ...rest } = details;

  return await trx
  .updateTable('users_session')
  .set(rest)
  .where("id", "=", sessionId)
  .executeTakeFirst();
}