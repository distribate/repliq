import type { AUTH } from "@repo/types/db/auth-database-types.ts";
import type { Selectable } from "kysely";
import { authDB } from "../../shared/database/auth-db";

export type FindPlayerExtractedColumns = Array<keyof Selectable<AUTH>>;

type FindPlayerCriteria = Partial<Pick<AUTH, "NICKNAME" | "UUID">>; // only nickname or uuid

export type FindPlayerAuth<T extends FindPlayerExtractedColumns> = {
  criteria: FindPlayerCriteria;
  extractedFields: T;
};

export async function findPlayer<T extends FindPlayerExtractedColumns>({
  extractedFields,
  criteria,
}: FindPlayerAuth<T>): Promise<Pick<AUTH, T[number]> | null> {
  let query = authDB.selectFrom("AUTH");

  if (criteria.NICKNAME) {
    query = query.where("NICKNAME", "=", criteria.NICKNAME);
  }

  if (criteria.UUID) {
    query = query.where("UUID", "=", criteria.UUID);
  }

  query = query.select(extractedFields);

  const result = await query
    .limit(1)
    .executeTakeFirst();

  if (!result) {
    return null;
  }

  return result as Pick<AUTH, T[number]>;
}