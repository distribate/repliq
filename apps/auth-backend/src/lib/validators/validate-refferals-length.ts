import type { DB } from "@repo/types/db/forum-database-types";
import type { Transaction } from "kysely";

const REFFERALS_LIMIT = 5

export async function validateRefferalsLength(trx: Transaction<DB>, referrer: string) {
  const refferalsList = await trx
    .selectFrom("refferals")
    .select("id")
    .where("initiator", "=", referrer)
    .execute()

  if (refferalsList && refferalsList.length >= REFFERALS_LIMIT) {
    return false;
  }

  return true;
}