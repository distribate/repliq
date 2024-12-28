import { Kysely } from 'kysely';
import { authDialect } from "@repo/shared/db/auth-db";
import type { DB as AuthDB } from "@repo/types/db/auth-database-types";
import { forumDialect } from '@repo/shared/db/forum-db';
import type { DB as forumDBType } from "@repo/types/db/forum-database-types";

export const authDB = new Kysely<AuthDB>({
  dialect: authDialect({
    host: "127.0.0.1",
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    port: Number(process.env.POSTGRES_PORT!),
  })
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