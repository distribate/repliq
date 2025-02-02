import { ErrorsLog } from "@repo/types/db/forum-database-types";
import { forumDB } from "../shared/database/forum-db";
import type { Insertable } from "kysely";

type CreateErrorLog = Omit<Insertable<ErrorsLog>, "created_at" | "id">

export async function createErrorLog({
  description, initiator, recipient, type
}: CreateErrorLog) {
  const query = await forumDB
    .insertInto("errors_log")
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