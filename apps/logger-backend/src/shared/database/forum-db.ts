import { Kysely, PostgresDialect } from 'kysely';
import type { DB as forumDBType } from "@repo/types/db/forum-database-types";
import type { DatabaseConnection } from '@repo/types/entities/database-connection-type';
import { Pool } from 'pg';

const forumDialect = ({
  host, database, user, password, port, tenantId
}: DatabaseConnection & { tenantId: string }) => {
  return new PostgresDialect({ pool: new Pool({ database, host, port, password, user: `${user}.${tenantId}`, max: 40, idleTimeoutMillis: 2000 }) });
};

export const forumDB = new Kysely<forumDBType>({
  dialect: forumDialect({
    host: "127.0.0.1",
    database: Bun.env.POSTGRES_DB!,
    user: Bun.env.POSTGRES_USER!,
    password: Bun.env.POSTGRES_PASSWORD!,
    port: Number(Bun.env.POSTGRES_PORT!),
    tenantId: Bun.env.POSTGRES_TENANT_ID!,
  }),
});