import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

type ForumDialect = {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
  tenantId: string;
};

export const forumDialect = ({
  host, database, user, password, port, tenantId
}: ForumDialect) => {
  return new PostgresDialect({
    pool: new Pool({
      database, host, port, password,
      user: `${user}.${tenantId}`,
      max: 40,
      idleTimeoutMillis: 2000,
    }),
  });
};