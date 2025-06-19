import type { Insertable } from "kysely";
import { sqliteDB } from "../shared/database/sqlite-db";
import { ErrorsLogs } from "@repo/types/db/sqlite-database-types";

type CreateErrorLog = Omit<Insertable<ErrorsLogs>, "created_at" | "id">

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