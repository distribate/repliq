import { forumDialect } from '@repo/shared/db/forum-db';
import { lpDialect } from '@repo/shared/db/luckperms-db';
import { authDialect } from '@repo/shared/db/auth-db';
import { Kysely } from "kysely";
import type { DB as lpDBType } from "@repo/types/db/luckperms-database-types.ts";
import type { DB as authDBType } from "@repo/types/db/auth-database-types.ts";
import type { DB as forumDBType } from "@repo/types/db/forum-database-types.ts";

export const lpDB = new Kysely<lpDBType>({
  dialect: lpDialect,
});

export const authDB = new Kysely<authDBType>({
  dialect: authDialect,
});

export const forumDB = new Kysely<forumDBType>({
  dialect: forumDialect,
});