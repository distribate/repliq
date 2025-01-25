import { playerPointsDialect } from "@repo/shared/db/player-points-db.ts";
import type { DB as playerPointsDBType } from "@repo/types/db/player-points-database-types.ts";
import { Kysely } from "kysely";

export const playerPointsDB = new Kysely<playerPointsDBType>({
  dialect: playerPointsDialect({
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    port: Number(process.env.PLAYERPOINTS_MYSQL_PORT!),
    database: "playerpoints",
    host: "127.0.0.1"
  })
});