import type { DB as bisquiteDBType } from "@repo/types/db/bisquite-database-types.ts";
import { Kysely } from "kysely";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";

const bisquiteDialect = ({
  user, password, port, database, host
}: DatabaseConnection) => {
  return new MysqlDialect({ pool: createPool({ database, host, user, password, port, connectionLimit: 10 }) });
};

export const bisquiteDB = new Kysely<bisquiteDBType>({
  dialect: bisquiteDialect({
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.BISQUITE_MYSQL_PORT!),
    database: "bisquite",
    host: "5.83.140.56"
  })
}); 