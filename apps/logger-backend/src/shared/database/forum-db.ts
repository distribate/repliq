import { Kysely } from 'kysely';
import type { DB as forumDBType } from "@repo/types/db/forum-database-types";
import { forumDialect } from '@repo/shared/db/forum-db';

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