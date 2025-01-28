import { Kysely, PostgresDialect } from "kysely";
import type { DB as authDBType } from "@repo/types/db/auth-database-types.ts";
import type { DatabaseConnection } from "@repo/types/entities/database-connection-type";
import { Pool } from "pg";

const authDialect = ({
  host, database, user, password, port
}: DatabaseConnection) => {
  return new PostgresDialect({ pool: new Pool({ database, host, user, port, max: 10, password }) });
};

export const authDB = new Kysely<authDBType>({
  dialect: authDialect({
    host: "127.0.0.1",
    database: Bun.env.AUTHORIZATION_POSTGRES_DB!,
    user: Bun.env.AUTHORIZATION_POSTGRES_USER!,
    password: Bun.env.AUTHORIZATION_POSTGRES_PASSWORD!,
    port: Number(Bun.env.AUTHORIZATION_POSTGRES_PORT!),
  }),
});
