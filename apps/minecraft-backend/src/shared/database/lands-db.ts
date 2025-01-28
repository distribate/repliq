import { Kysely } from "kysely";
import type { DB as landsDBType } from "@repo/types/db/lands-database-types.ts";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";

const landsDialect = ({
  user, password, port, database, host
}: DatabaseConnection) => {
  return new MysqlDialect({ pool: createPool({ database, host, user, password, port, connectionLimit: 10 }) });
};

export const landsDB = new Kysely<landsDBType>({
  dialect: landsDialect({
    host: "127.0.0.1",
    database: Bun.env.LANDS_MYSQL_DB!,
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.LANDS_MYSQL_PORT!),
  }),
});