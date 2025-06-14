import { sqliteDB } from "#shared/database/sqlite-db.ts";

type CreateErrorLog = { type: string, description: string, initiator: string, recipient: string }

export async function createErrorLog({
  description, initiator, recipient, type
}: CreateErrorLog) {
  return sqliteDB
    .insertInto("errors_logs")
    .values({
      type, description, initiator, recipient
    })
    .returningAll()
    .executeTakeFirst();
}