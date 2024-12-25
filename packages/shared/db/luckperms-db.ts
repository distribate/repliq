import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB as lpDBType } from "@repo/types/db/luckperms-database-types.ts";

export const lpDialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.LUCKPERMS_POSTGRES_DB,
    host: "127.0.0.1",
    user: process.env.LUCKPERMS_POSTGRES_USER,
    port: Number(process.env.LUCKPERMS_POSTGRES_PORT),
    max: 10,
    password: process.env.LUCKPERMS_POSTGRES_PASSWORD,
  }),
});

export const lpDB = new Kysely<lpDBType>({ dialect: lpDialect });