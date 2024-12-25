import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { DB as forumDBType } from '@repo/types/db/forum-database-types.ts';

const database = process.env.POSTGRES_DB!;
const postgresUser = process.env.POSTGRES_USER!;
const postgresTenantId = process.env.POSTGRES_TENANT_ID!;
const password = process.env.POSTGRES_PASSWORD!;
const port = Number(process.env.POSTGRES_PORT!);
const host = '127.0.0.1';

export const forumDialect = new PostgresDialect({
  pool: new Pool({
    database, host, port, password,
    user: `${postgresUser}.${postgresTenantId}`,
    max: 40,
    idleTimeoutMillis: 2000,
  }),
});

export const forumDB = new Kysely<forumDBType>({ dialect: forumDialect });