import { Kysely } from "kysely";
import { landsDialect } from "@repo/shared/db/lands-db.ts";
import type { DB as landsDBType } from "@repo/types/db/lands-database-types.ts";

export const landsDB = new Kysely<landsDBType>({
  dialect: landsDialect({
    host: "127.0.0.1",
    database: Bun.env.LANDS_MYSQL_DB!,
    user: Bun.env.MYSQL_USER!,
    password: Bun.env.MYSQL_ROOT_PASSWORD!,
    port: Number(Bun.env.LANDS_MYSQL_PORT!),
  }),
});