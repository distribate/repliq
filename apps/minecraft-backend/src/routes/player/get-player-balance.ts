import { bisquiteDB } from "#shared/database/bisquite-db.ts";
import { playerPointsDB } from "#shared/database/playerpoints-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getBelkoin(nickname: string) {
  return playerPointsDB
    .selectFrom("playerpoints_username_cache")
    .innerJoin("playerpoints_points", "playerpoints_points.uuid", "playerpoints_username_cache.uuid")
    .select("playerpoints_points.points")
    .where("playerpoints_username_cache.username", "=", nickname)
    .executeTakeFirst()
}

async function getCharism(nickname: string) {
  return bisquiteDB
    .selectFrom("CMI_users")
    .select("Balance")
    .where("username", "=", nickname)
    .executeTakeFirst()
}

async function getUserBalance(nickname: string) {
  const [belkoin, charism] = await Promise.all([
    getBelkoin(nickname),
    getCharism(nickname)
  ])

  return {
    charism: charism?.Balance ? charism?.Balance.toFixed(1) : 0,
    belkoin: belkoin?.points?.toFixed(1) ?? 0
  }
}

export const getPlayerBalanceRoute = new Hono()
  .get("/get-player-balance", async (ctx) => {
    const nickname = getNickname()

    try {
      const balance = await getUserBalance(nickname)

      if (!balance) {
        return ctx.json({ data: { charism: 0, belkoin: 0 } }, 200)
      }

      return ctx.json({ data: balance }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })