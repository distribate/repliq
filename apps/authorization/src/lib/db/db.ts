import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { DB as lpDBType } from "@repo/types/db/luckperms-database-types.ts";
import type { DB as authDBType } from "@repo/types/db/auth-database-types.ts";
import type { DB as forumDBType } from "@repo/types/db/forum-database-types.ts";
import {
  LP_DB_PORT,
  LP_DB_NAME,
  LP_DB_USER,
  LP_DB_PASS,
  AUTH_DB_PASS,
  AUTH_DB_PORT,
  AUTH_DB_USER,
  AUTH_DB_NAME,
  FORUM_DB_USER,
  FORUM_DB_PORT,
  FORUM_DB_NAME,
  FORUM_DB_PASS,
} from "#utils/initialize-env.ts";

const forumDialect = new PostgresDialect({
  pool: new Pool({
    database: FORUM_DB_NAME,
    host: "127.0.0.1",
    user: FORUM_DB_USER,
    port: Number(FORUM_DB_PORT),
    max: 10,
    password: FORUM_DB_PASS,
  }),
});

const lpDialect = new PostgresDialect({
  pool: new Pool({
    database: LP_DB_NAME,
    host: "127.0.0.1",
    user: LP_DB_USER,
    port: Number(LP_DB_PORT),
    max: 10,
    password: LP_DB_PASS,
  }),
});

const authDialect = new PostgresDialect({
  pool: new Pool({
    database: AUTH_DB_NAME,
    host: "127.0.0.1",
    user: AUTH_DB_USER,
    port: Number(AUTH_DB_PORT),
    max: 10,
    password: AUTH_DB_PASS,
  }),
});

export const lpDB = new Kysely<lpDBType>({
  dialect: lpDialect,
});

export const authDB = new Kysely<authDBType>({
  dialect: authDialect,
});

export const forumDB = new Kysely<forumDBType>({
  dialect: forumDialect,
});
