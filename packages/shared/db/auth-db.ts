import { PostgresDialect } from "kysely";
import { Pool } from "pg";

export const authDialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.AUTHORIZATION_POSTGRES_DB,
    host: "127.0.0.1",
    user: process.env.AUTHORIZATION_POSTGRES_USER,
    port: Number(process.env.AUTHORIZATION_POSTGRES_PORT),
    max: 10,
    password: process.env.AUTHORIZATION_POSTGRES_PASSWORD,
  }),
})