import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import type { DB } from '../types/db/database-types.ts';
import { DB_NAME, DB_PASS, DB_PORT, DB_USER } from '#utils/initialize-env.ts';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: DB_NAME,
    host: '127.0.0.1',
    user: DB_USER,
    port: DB_PORT,
    max: 10,
    password: DB_PASS
  })
})

export const db = new Kysely<DB>({ dialect })