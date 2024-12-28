import { MysqlDialect } from "kysely";
import { createPool  } from "mysql2";

type SkinsDialect = {
  user: string;
  password: string;
  port: number,
  database: string,
  host: string
}

export const skinsDialect = ({
  user, password, port, database, host
}: SkinsDialect) => {
  return new MysqlDialect({
    pool: createPool({
      database,
      host,
      user,
      password,
      port,
      connectionLimit: 10,
    }),
  });
};