import { cmiDialect } from "@repo/shared/db/cmi-db";
import type { DB as cmiDBType } from "@repo/types/db/cmi-database-types.ts";
import { Kysely } from "kysely";

export const cmiDB = new Kysely<cmiDBType>({
  dialect: cmiDialect({
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.CMI_MYSQL_PORT!),
    database: "cmi",
    host: "127.0.0.1"
  })
}); 