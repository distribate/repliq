import { Kysely, PostgresDialect } from 'kysely';
import type { DB as AuthDB } from "@repo/types/db/auth-database-types";
import type { DatabaseConnection } from '@repo/types/entities/database-connection-type';
import { Pool } from 'pg';

const authDialect = ({
  host, database, user, password, port
}: DatabaseConnection) => {
  return new PostgresDialect({
    pool: new Pool({
      database, host, user, port, password,
      max: 16,
      keepAlive: true,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    })
  });
};

export const authDB = new Kysely<AuthDB>({
  dialect: authDialect({
    host: "127.0.0.1",
    database: process.env.AUTHORIZATION_POSTGRES_DB!,
    user: process.env.AUTHORIZATION_POSTGRES_USER!,
    password: process.env.AUTHORIZATION_POSTGRES_PASSWORD!,
    port: Number(process.env.AUTHORIZATION_POSTGRES_PORT!),
  })
});