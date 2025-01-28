import { Kysely } from "kysely";
import type { DB as forumDBType } from '@repo/types/db/forum-database-types.ts';
import type { DatabaseConnection } from '@repo/types/entities/database-connection-type';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const forumDialect = ({
  host, database, user, password, port, tenantId
}: DatabaseConnection & { tenantId: string }) => {
  return new PostgresDialect({ pool: new Pool({ database, host, port, password, user: `${user}.${tenantId}`, max: 40, idleTimeoutMillis: 2000 }) });
};

export const forumDB = new Kysely<forumDBType>({
  dialect: forumDialect({
    host: '127.0.0.1',
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    port: Number(process.env.POSTGRES_PORT!),
    tenantId: process.env.POSTGRES_TENANT_ID!
  })
});