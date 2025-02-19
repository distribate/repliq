import { Kysely } from "kysely";
import type { DB as paymentsDBType } from "@repo/types/db/payments-database-types.ts";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";

const paymentsDialect = ({
  host, database, user, password, port
}: DatabaseConnection) => {
  return new PostgresDialect({ pool: new Pool({ database, host, port, password, user, max: 10, }) });
};

export const paymentsDB = new Kysely<paymentsDBType>({ dialect: paymentsDialect({
    host: "127.0.0.1",
    database: process.env.PAYMENTS_POSTGRES_DB!,
    user: process.env.PAYMENTS_POSTGRES_USER!,
    password: process.env.PAYMENTS_POSTGRES_PASSWORD!,
    port: Number(process.env.PAYMENTS_POSTGRES_PORT!),
  }) 
});