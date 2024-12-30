import { lpDialect } from '@repo/shared/db/luckperms-db.ts';
import { Kysely } from 'kysely';
import type { DB as lpDBType } from "@repo/types/db/luckperms-database-types"

export const lpDB = new Kysely<lpDBType>({ dialect: lpDialect({
    host: "127.0.0.1",
    database: process.env.LUCKPERMS_POSTGRES_DB!,
    user: process.env.LUCKPERMS_POSTGRES_USER!,
    password: process.env.LUCKPERMS_POSTGRES_PASSWORD!,
    port: Number(process.env.LUCKPERMS_POSTGRES_PORT!),
  }) 
});