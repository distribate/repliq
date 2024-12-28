import { PostgresDialect } from "kysely";
import { Pool } from "pg";

type AuthDialect = {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
};
    
export const authDialect = ({
  host, database, user, password, port
}: AuthDialect) => {
  return new PostgresDialect({
    pool: new Pool({
      database,
      host,
      user,
      port,
      max: 10,
      password,
    }),
  });
};