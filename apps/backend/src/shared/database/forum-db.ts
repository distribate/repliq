import { Kysely, PostgresDialect } from 'kysely';
import type { DB as forumDBType } from "@repo/types/db/forum-database-types";
import { Pool, type PoolConfig } from 'pg';
import { isProduction } from '#helpers/is-production.ts';

interface AppGlobal {
  pgPool?: Pool;
  forumDB?: Kysely<forumDBType>;
}

const appGlobal = globalThis as unknown as AppGlobal;

const config: PoolConfig = {
  database: Bun.env.POSTGRES_DB,
  host: Bun.env.POSTGRES_HOST,
  port: Number(Bun.env.POSTGRES_PORT),
  user: `${Bun.env.POSTGRES_USER}.${Bun.env.POSTGRES_TENANT_ID}`,
  password: Bun.env.POSTGRES_PASSWORD,
  max: isProduction ? 16 : 8,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
};

const pool = new Pool(config);

pool.on('error', (err, client) => {
  console.error('[Database]: Error', err);
});

function getDbInstance(): Kysely<forumDBType> {
  if (!appGlobal.forumDB) {
    console.log('[Database]: Creating new instance of pool');

    appGlobal.forumDB = new Kysely<forumDBType>({
      dialect: new PostgresDialect({ pool: pool })
    });
  }

  return appGlobal.forumDB;
}

if (!appGlobal.forumDB) {
  console.log('[Database]: Creating new instance of pool');

  appGlobal.forumDB = new Kysely<forumDBType>({
    dialect: new PostgresDialect({ pool: pool })
  });
}

export const forumDB = getDbInstance();