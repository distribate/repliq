import { Kysely } from 'kysely';
import { authDialect } from "@repo/shared/db/auth-db";
import type { DB as AuthDB } from "@repo/types/db/auth-database-types";

export const authDB = new Kysely<AuthDB>({
  dialect: authDialect
});