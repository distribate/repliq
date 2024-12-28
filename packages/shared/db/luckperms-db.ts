import { PostgresDialect } from "kysely";
import { Pool } from "pg";

type LpDialect = {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
};

export const lpDialect = ({
  host, database, user, password, port
}: LpDialect) => {
  return new PostgresDialect({
    pool: new Pool({
      database, host, port, password,
      user,
      max: 10,
    }),
  });
};