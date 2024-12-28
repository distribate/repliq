import { PostgresDialect } from "kysely";
import { Pool } from "pg";

type PaymentsDialect = {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
};

export const paymentsDialect = ({
  host, database, user, password, port
}: PaymentsDialect) => {
  return new PostgresDialect({
    pool: new Pool({
      database, host, port, password,
      user,
      max: 10,
    }),
  });
};