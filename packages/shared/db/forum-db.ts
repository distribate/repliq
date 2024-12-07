import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB as forumDBType } from "@repo/types/db/forum-database-types.ts"

const forumDialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.POSTGRES_DB,
    host: "127.0.0.1",
    user: `${process.env.POSTGRES_USER}.${process.env.POSTGRES_TENANT_ID}`,
    port: Number(process.env.POSTGRES_PORT),
    max: 10,
    password: process.env.POSTGRES_PASSWORD,
  }),
});

export const forumDB = new Kysely<forumDBType>({ dialect: forumDialect })