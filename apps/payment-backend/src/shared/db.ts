import { paymentsDialect } from "@repo/shared/db/payments-db.ts";
import { Kysely } from "kysely";
import { forumDialect } from "@repo/shared/db/forum-db.ts";
import { lpDialect } from "@repo/shared/db/luckperms-db.ts";
import type { DB as paymentsDBType } from "@repo/types/db/payments-database-types.ts";
import type { DB as lpDBType } from "@repo/types/db/luckperms-database-types.ts";
import type { DB as forumDBType } from '@repo/types/db/forum-database-types.ts';

export const forumDB = new Kysely<forumDBType>({ dialect: forumDialect({
  host: '127.0.0.1', 
  database: process.env.POSTGRES_DB!,
  user: process.env.POSTGRES_USER!, 
  password: process.env.POSTGRES_PASSWORD!, 
  port: Number(process.env.POSTGRES_PORT!), 
  tenantId: process.env.POSTGRES_TENANT_ID!
}) 
});

export const lpDB = new Kysely<lpDBType>({ dialect: lpDialect({
  host: "127.0.0.1",
  database: process.env.LUCKPERMS_POSTGRES_DB!,
  user: process.env.LUCKPERMS_POSTGRES_USER!,
  password: process.env.LUCKPERMS_POSTGRES_PASSWORD!,
  port: Number(process.env.LUCKPERMS_POSTGRES_PORT!),
  }) 
});

export const paymentsDB = new Kysely<paymentsDBType>({ dialect: paymentsDialect({
    host: "127.0.0.1",
    database: process.env.PAYMENTS_POSTGRES_DB!,
    user: process.env.PAYMENTS_POSTGRES_USER!,
    password: process.env.PAYMENTS_POSTGRES_PASSWORD!,
    port: Number(process.env.PAYMENTS_POSTGRES_PORT!),
  }) 
});