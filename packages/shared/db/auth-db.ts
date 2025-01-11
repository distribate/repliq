import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type.ts";

export const authDialect = ({
  host, database, user, password, port
}: DatabaseConnection) => {
  return new PostgresDialect({
    pool: new Pool({ database, host, user, port, max: 10, password }),
  });
};