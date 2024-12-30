import { paymentsDialect } from "@repo/shared/db/payments-db.ts";
import { Kysely } from "kysely";
import type { DB as paymentsDBType } from "@repo/types/db/payments-database-types.ts";

export const paymentsDB = new Kysely<paymentsDBType>({ dialect: paymentsDialect({
    host: "127.0.0.1",
    database: process.env.PAYMENTS_POSTGRES_DB!,
    user: process.env.PAYMENTS_POSTGRES_USER!,
    password: process.env.PAYMENTS_POSTGRES_PASSWORD!,
    port: Number(process.env.PAYMENTS_POSTGRES_PORT!),
  }) 
});