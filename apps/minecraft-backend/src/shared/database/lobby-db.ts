import type { DB as lobbyDBType } from "@repo/types/db/lobby-database-types.ts";
import { Kysely } from "kysely";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";

const lobbyDialect = ({
  user, password, port, database, host
}: DatabaseConnection) => {
  return new MysqlDialect({ pool: createPool({ database, host, user, password, port, connectionLimit: 10 }) });
};

export const lobbyDB = new Kysely<lobbyDBType>({
  dialect: lobbyDialect({
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.LOBBY_MYSQL_PORT!),
    database: "lobby",
    host: "5.83.140.56"
  })
}); 