import type { DB as cmiDBType } from "@repo/types/db/cmi-database-types.ts";
import { Kysely } from "kysely";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";

const cmiDialect = ({
  user, password, port, database, host
}: DatabaseConnection) => {
  return new MysqlDialect({ pool: createPool({ database, host, user, password, port, connectionLimit: 10 }) });
};

export const cmiDB = new Kysely<cmiDBType>({
  dialect: cmiDialect({
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.CMI_MYSQL_PORT!),
    database: "cmi",
    host: "127.0.0.1"
  })
}); 