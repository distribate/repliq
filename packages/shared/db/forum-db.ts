import { DatabaseConnection } from '@repo/types/entities/database-connection-type';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const forumDialect = ({
  host, database, user, password, port, tenantId
}: DatabaseConnection & { tenantId: string }) => {
  return new PostgresDialect({
    pool: new Pool({ database, host, port, password, user: `${user}.${tenantId}`, max: 40, idleTimeoutMillis: 2000 }),
  });
};