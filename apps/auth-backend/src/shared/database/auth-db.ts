import { Kysely, PostgresDialect } from "kysely";
import type { DB as authDBType } from "@repo/types/db/auth-database-types.ts";
import { Pool, type PoolConfig } from "pg";
import { isProduction } from "@repo/lib/helpers/is-production";

interface AppGlobal {
  pgPool?: Pool;
  authDB?: Kysely<authDBType>;
}

const appGlobal = globalThis as unknown as AppGlobal;

const config: PoolConfig = {
  database: Bun.env.AUTHORIZATION_POSTGRES_DB!,
  host: "127.0.0.1",
  user: Bun.env.AUTHORIZATION_POSTGRES_USER!,
  password: Bun.env.AUTHORIZATION_POSTGRES_PASSWORD!,
  port: Number(Bun.env.AUTHORIZATION_POSTGRES_PORT!),
  max: isProduction ? 16 : 8,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
}

const pool = new Pool(config);

pool.on('error', (err, client) => {
  console.error('[Auth Database]: Error', err);
});

function getDbInstance(): Kysely<authDBType> {
  if (!appGlobal.authDB) {
    console.log('[Auth Database]: Creating new instance of pool');

    appGlobal.authDB = new Kysely<authDBType>({
      dialect: new PostgresDialect({ pool: pool })
    });
  }

  return appGlobal.authDB;
}

if (!appGlobal.authDB) {
  console.log('[Auth Database]: Creating new instance of pool');

  appGlobal.authDB = new Kysely<authDBType>({
    dialect: new PostgresDialect({ pool: pool })
  });
}

export const authDB = getDbInstance();