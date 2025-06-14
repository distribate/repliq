import { sqliteDB } from '#shared/database/sqlite-db.ts';

type CreateErrorLog = { type: string, description: string, initiator: string, recipient: string }

export async function createErrorLog({
  description, initiator, recipient, type
}: CreateErrorLog) {
  const query = await sqliteDB
    .insertInto("errors_logs")
    .values({
      type, description, initiator, recipient
    })
    .returningAll()
    .executeTakeFirst();

  if (!query) {
    return;
  }

  return query;
}