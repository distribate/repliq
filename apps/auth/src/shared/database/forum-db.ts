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
  host: isProduction ? Bun.env.MAIN_POSTGRES_HOST : "127.0.0.1",
  database: Bun.env.MAIN_POSTGRES_DB,
  password: Bun.env.MAIN_POSTGRES_PASSWORD,
  port: Number(Bun.env.MAIN_POSTGRES_PORT),
  user: `${Bun.env.MAIN_POSTGRES_USER}.${Bun.env.MAIN_POSTGRES_TENANT_ID}`,
  max: isProduction ? 16 : 8,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
};

const pool = new Pool(config);

pool.on('error', (err, client) => {
  console.error('[Forum Database]: Error', err);
});

function getDbInstance(): Kysely<forumDBType> {
  if (!appGlobal.forumDB) {
    console.log('[Forum Database]: Creating new instance of pool');

    appGlobal.forumDB = new Kysely<forumDBType>({
      dialect: new PostgresDialect({
        pool: pool,
      }),
    });
  }

  return appGlobal.forumDB;
}

if (!appGlobal.forumDB) {
  console.log('[Forum Database]: Creating new instance of pool');

  appGlobal.forumDB = new Kysely<forumDBType>({
    dialect: new PostgresDialect({ pool: pool }),
  });
}

export const forumDB = getDbInstance();