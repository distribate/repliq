import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";

export const cmiDialect = ({
  user, password, port, database, host
}: DatabaseConnection) => {
  return new MysqlDialect({ pool: createPool({ database, host, user, password, port, connectionLimit: 10 }) });
};