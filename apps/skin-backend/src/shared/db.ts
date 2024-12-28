import { forumDialect } from '@repo/shared/db/forum-db';
import { Kysely } from 'kysely';
import { skinsDialect } from '@repo/shared/db/skins-db';
import type { DB as skinsDBType } from "@repo/types/db/skins-database-types.ts";
import type { DB as forumDBType } from '@repo/types/db/forum-database-types.ts';

const database = process.env.POSTGRES_DB!;
const postgresUser = process.env.POSTGRES_USER!;
const postgresTenantId = process.env.POSTGRES_TENANT_ID!;
const password = process.env.POSTGRES_PASSWORD!;
const port = Number(process.env.POSTGRES_PORT!);
const host = '127.0.0.1';

export const forumDB = new Kysely<forumDBType>({ dialect: forumDialect({
    host, 
    database,
    user: postgresUser, 
    password, 
    port, 
    tenantId: postgresTenantId
  }) 
});

export const skinsDB = new Kysely<skinsDBType>({ dialect: skinsDialect({
    user: process.env.SKINS_PROXY_MYSQL_USER!,
    password: process.env.SKINS_PROXY_MYSQL_PASSWORD!,
    port: Number(process.env.SKINS_PROXY_MYSQL_PORT!),
    database: "skins_proxy",
    host: "127.0.0.1"
  }) 
});