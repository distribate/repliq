import { forumDialect } from '@repo/shared/db/forum-db.ts';
import { lpDialect } from '@repo/shared/db/luckperms-db.ts';
import { authDialect } from '@repo/shared/db/auth-db.ts';
import { Kysely } from "kysely";
import type { DB as lpDBType } from "@repo/types/db/luckperms-database-types.ts";
import type { DB as authDBType } from "@repo/types/db/auth-database-types.ts";
import type { DB as forumDBType } from "@repo/types/db/forum-database-types.ts";

export const lpDB = new Kysely<lpDBType>({
  dialect: lpDialect({
    host: "127.0.0.1",
    database: process.env.LUCKPERMS_POSTGRES_DB!,
    user: process.env.LUCKPERMS_POSTGRES_USER!,
    password: process.env.LUCKPERMS_POSTGRES_PASSWORD!,
    port: Number(process.env.LUCKPERMS_POSTGRES_PORT!),
  }),
});

export const authDB = new Kysely<authDBType>({
  dialect: authDialect({
    host: "127.0.0.1",
    database: process.env.AUTHORIZATION_POSTGRES_DB!,
    user: process.env.AUTHORIZATION_POSTGRES_USER!,
    password: process.env.AUTHORIZATION_POSTGRES_PASSWORD!,
    port: Number(process.env.AUTHORIZATION_POSTGRES_PORT!),
  }),
});

export const forumDB = new Kysely<forumDBType>({
  dialect: forumDialect({
    host: "127.0.0.1",
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    port: Number(process.env.POSTGRES_PORT!),
    tenantId: process.env.POSTGRES_TENANT_ID!,
  }),
});