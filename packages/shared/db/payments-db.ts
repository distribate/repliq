import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB as paymentsDBType } from "@repo/types/db/payments-database-types.ts";

const paymentsDialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.PAYMENTS_POSTGRES_DB,
    host: "127.0.0.1",
    user: process.env.PAYMENTS_POSTGRES_USER,
    port: Number(process.env.PAYMENTS_POSTGRES_PORT),
    max: 10,
    password: process.env.PAYMENTS_POSTGRES_PASSWORD,
  }),
});

export const paymentsDB = new Kysely<paymentsDBType>({ dialect: paymentsDialect });