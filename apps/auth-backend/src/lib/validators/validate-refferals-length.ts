import type { DB } from "@repo/types/db/forum-database-types";
import type { Transaction } from "kysely";
import { REFFERALS_LIMIT } from "../../shared/constants/limits";

type ValidateRefsLength = {
  trx: Transaction<DB>,
  referrer: string
}

export async function validateRefferalsLength({
  referrer, trx
}: ValidateRefsLength) {
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