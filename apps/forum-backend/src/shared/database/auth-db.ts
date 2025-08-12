import { Kysely, PostgresDialect } from 'kysely';
import type { DB as AuthDB } from "@repo/types/db/auth-database-types";
import { Pool, type PoolConfig } from 'pg';
import { isProduction } from '@repo/lib/helpers/is-production';
import { LoggingPool } from '#utils/database.ts';

interface AppGlobal {
  pgPool?: Pool;
  authDB?: Kysely<AuthDB>;
}

const appGlobal = globalThis as unknown as AppGlobal;

const config: PoolConfig = {
  database: process.env.AUTHORIZATION_POSTGRES_DB,
  host: Bun.env.AUTHORIZATION_POSTGRES_HOST,
  port: Number(process.env.AUTHORIZATION_POSTGRES_PORT),
  user: process.env.AUTHORIZATION_POSTGRES_USER,
  password: process.env.AUTHORIZATION_POSTGRES_PASSWORD,
  max: isProduction ? 16 : 8,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
}

const pool = new LoggingPool(config);

pool.on('error', (err, client) => {
  console.error('[Auth Database]: Error', err);
});

function getDbInstance(): Kysely<AuthDB> {
  if (!appGlobal.authDB) {
    console.log('[Auth Database]: Creating new instance of pool');

    appGlobal.authDB = new Kysely<AuthDB>({
      dialect: new PostgresDialect({ pool: pool })
    });
  }

  return appGlobal.authDB;
}

if (!appGlobal.authDB) {
  console.log('[Auth Database]: Creating new instance of pool');

  appGlobal.authDB = new Kysely<AuthDB>({
    dialect: new PostgresDialect({ pool: pool })
  });
}

export const authDB = getDbInstance();