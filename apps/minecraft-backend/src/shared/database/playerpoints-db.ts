import type { DB as playerPointsDBType } from "@repo/types/db/player-points-database-types.ts";
import { Kysely } from "kysely";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";

const playerPointsDialect = ({
  user, password, port, database, host
}: DatabaseConnection) => {
  return new MysqlDialect({ pool: createPool({ database, host, user, password, port, connectionLimit: 10 }) });
};

export const playerPointsDB = new Kysely<playerPointsDBType>({
  dialect: playerPointsDialect({
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.PLAYERPOINTS_MYSQL_PORT!),
    database: "playerpoints",
    host: "5.83.140.56"
  })
}); 