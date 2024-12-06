import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB as paymentsDBType } from "@repo/types/db/payments-database-types.ts";
import type { DB as lpDBType } from "@repo/types/db/luckperms-database-types.ts";
import type { DB as forumDBType } from "@repo/types/db/forum-database-types.ts"
import type { DB as authDBType } from "@repo/types/db/auth-database-types.ts"

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

const paymentsDialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.PAYMENTS_POSTGRES_DB,
    host: "127.0.0.1",
    user: process.env.PAYMENTS_POSTGRES_USER,
    port: Number(process.env.PAYMENTS_POSTGRES_PORT),
    max: 10,
    password: process.env.PAYMENTS_POSTGRES_PASSWORD,
  }),
});

const lpDialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.LUCKPERMS_POSTGRES_DB,
    host: "127.0.0.1",
    user: process.env.LUCKPERMS_POSTGRES_USER,
    port: Number(process.env.LUCKPERMS_POSTGRES_PORT),
    max: 10,
    password: process.env.LUCKPERMS_POSTGRES_PASSWORD,
  }),
});

export const forumDB = new Kysely<forumDBType>({ dialect: forumDialect })
export const lpDB = new Kysely<lpDBType>({ dialect: lpDialect });
export const paymentsDB = new Kysely<paymentsDBType>({ dialect: paymentsDialect });
export const authDB = new Kysely<authDBType>({ dialect: authDialect })