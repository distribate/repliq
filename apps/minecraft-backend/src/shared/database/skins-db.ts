import type { DB as skinsDBType } from "@repo/types/db/skins-database-types.ts";
import { Kysely } from "kysely";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";

const skinsDialect = ({
  user, password, port, database, host
}: DatabaseConnection) => {
  return new MysqlDialect({ pool: createPool({ database, host, user, password, port, connectionLimit: 10 }) });
};

export const skinsDB = new Kysely<skinsDBType>({
  dialect: skinsDialect({
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.SKINS_PROXY_MYSQL_PORT!),
    database: "skins_proxy",
    host: "5.83.140.56"
  })
});