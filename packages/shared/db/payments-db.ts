import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";

export const paymentsDialect = ({
  host, database, user, password, port
}: DatabaseConnection) => {
  return new PostgresDialect({ pool: new Pool({ database, host, port, password, user, max: 10, }) });
};