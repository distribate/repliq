import { Kysely, PostgresDialect } from 'kysely';
import type { DB as paymentsDBType } from "@repo/types/db/payments-database-types";
import type { DatabaseConnection } from '@repo/types/entities/database-connection-type';
import { Pool } from 'pg';

const paymentsDialect = ({
  host, database, user, password, port
}: DatabaseConnection) => {
  return new PostgresDialect({
    pool: new Pool({
      database, host, port, password,
      user,
      max: 16,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    })
  });
};

export const paymentsDB = new Kysely<paymentsDBType>({
  dialect: paymentsDialect({
    host: "127.0.0.1",
    database: Bun.env.PAYMENTS_POSTGRES_DB!,
    user: Bun.env.PAYMENTS_POSTGRES_USER!,
    password: Bun.env.PAYMENTS_POSTGRES_PASSWORD!,
    port: Number(Bun.env.PAYMENTS_POSTGRES_PORT!),
  }),
});