import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB as authDBType } from "@repo/types/db/auth-database-types.ts"

const authDialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.AUTHORIZATION_POSTGRES_DB,
    host: "127.0.0.1",
    user: process.env.AUTHORIZATION_POSTGRES_USER,
    port: Number(process.env.AUTHORIZATION_POSTGRES_PORT),
    max: 10,
    password: process.env.AUTHORIZATION_POSTGRES_PASSWORD,
  }),
})

export const authDB = new Kysely<authDBType>({ dialect: authDialect })