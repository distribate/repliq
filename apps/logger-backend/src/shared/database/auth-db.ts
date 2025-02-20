import { Kysely, PostgresDialect } from 'kysely';
import type { DB as AuthDB } from "@repo/types/db/auth-database-types";
import type { DatabaseConnection } from '@repo/types/entities/database-connection-type';
import { Pool } from 'pg';

const authDialect = ({
  host, database, user, password, port
}: DatabaseConnection) => {
  return new PostgresDialect({
    pool: new Pool({
      database,
      host,
      user,
      port,
      max: 10,
      password,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  });
};

export const authDB = new Kysely<AuthDB>({
  dialect: authDialect({
    host: "5.83.140.56",
    database: Bun.env.POSTGRES_DB!,
    user: Bun.env.POSTGRES_USER!,
    password: Bun.env.POSTGRES_PASSWORD!,
    port: Number(Bun.env.POSTGRES_PORT!),
  })
});