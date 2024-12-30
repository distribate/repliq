import { authDialect } from '@repo/shared/db/auth-db.ts';
import { Kysely } from "kysely";
import type { DB as authDBType } from "@repo/types/db/auth-database-types.ts";

export const authDB = new Kysely<authDBType>({
  dialect: authDialect({
    host: "127.0.0.1",
    database: process.env.AUTHORIZATION_POSTGRES_DB!,
    user: process.env.AUTHORIZATION_POSTGRES_USER!,
    password: process.env.AUTHORIZATION_POSTGRES_PASSWORD!,
    port: Number(process.env.AUTHORIZATION_POSTGRES_PORT!),
  }),
});
