import type { DB as reputationDBType } from "@repo/types/db/reputation-database-types.ts";
import { Kysely } from "kysely";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";

const reputationDialect = ({
  user, password, port, database, host
}: DatabaseConnection) => {
  return new MysqlDialect({ pool: createPool({ database, host, user, password, port, connectionLimit: 10 }) });
};

export const reputationDB = new Kysely<reputationDBType>({
  dialect: reputationDialect({
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.REPUTATION_MYSQL_PORT!),
    database: "reputation",
    host: "5.83.140.56"
  })
});