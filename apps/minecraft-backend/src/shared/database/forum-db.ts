import { forumDialect } from '@repo/shared/db/forum-db';
import { Kysely } from 'kysely';
import type { DB as forumDBType } from "@repo/types/db/forum-database-types";

export const forumDB = new Kysely<forumDBType>({
  dialect: forumDialect({
    host: "127.0.0.1",
    database: Bun.env.POSTGRES_DB!,
    user: Bun.env.POSTGRES_USER!,
    password: Bun.env.POSTGRES_PASSWORD!,
    port: Number(Bun.env.POSTGRES_PORT!),
    tenantId: Bun.env.POSTGRES_TENANT_ID!,
  }),
});