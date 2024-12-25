import { MysqlDialect } from "kysely";
import { createPool  } from "mysql2";

type SkinsDialect = {
  user: string;
  password: string;
  port: number
}

export const skinsDialect = (dialect: SkinsDialect) => {
  return new MysqlDialect({
    pool: createPool({
      database: 'skins_proxy',
      host: '127.0.0.1',
      user: dialect.user,
      password: dialect.password,
      port: dialect.port,
      connectionLimit: 10,
    }),
  });
};