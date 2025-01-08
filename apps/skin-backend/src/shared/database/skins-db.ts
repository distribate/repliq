import { skinsDialect } from "@repo/shared/db/skins-db";
import type { DB as skinsDBType } from "@repo/types/db/skins-database-types.ts";
import { Kysely } from "kysely";

export const skinsDB = new Kysely<skinsDBType>({
  dialect: skinsDialect({
    user: process.env.SKINS_PROXY_MYSQL_USER!,
    password: process.env.SKINS_PROXY_MYSQL_PASSWORD!,
    port: Number(process.env.SKINS_PROXY_MYSQL_PORT!),
    database: "skins_proxy",
    host: "127.0.0.1"
  })
});