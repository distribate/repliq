import { skinsDialect } from "@repo/shared/db/skins-db";
import type { DB as skinsDBType } from "@repo/types/db/skins-database-types.ts";
import { Kysely } from "kysely";

export const skinsDB = new Kysely<skinsDBType>({
  dialect: skinsDialect({
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.SKINS_PROXY_MYSQL_PORT!),
    database: "skins_proxy",
    host: "127.0.0.1"
  })
});