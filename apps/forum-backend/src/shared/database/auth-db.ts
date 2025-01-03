import { Kysely } from 'kysely';
import { authDialect } from "@repo/shared/db/auth-db";
import type { DB as AuthDB } from "@repo/types/db/auth-database-types";

export const authDB = new Kysely<AuthDB>({
  dialect: authDialect({
    host: "127.0.0.1",
    database: process.env.AUTHORIZATION_POSTGRES_DB!,
    user: process.env.AUTHORIZATION_POSTGRES_USER!,
    password: process.env.AUTHORIZATION_POSTGRES_PASSWORD!,
    port: Number(process.env.AUTHORIZATION_POSTGRES_PORT!),
  })
});