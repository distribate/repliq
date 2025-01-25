import { cmiDialect } from "@repo/shared/db/cmi-db";
import type { DB as cmiDBType } from "@repo/types/db/cmi-database-types.ts";
import { Kysely } from "kysely";

export const cmiDB = new Kysely<cmiDBType>({
  dialect: cmiDialect({
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    port: Number(process.env.CMI_MYSQL_PORT!),
    database: "cmi",
    host: "127.0.0.1"
  })
});