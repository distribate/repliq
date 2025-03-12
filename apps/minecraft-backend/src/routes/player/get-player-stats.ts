import { bisquiteDB } from "#shared/database/bisquite-db.ts";
import { reputationDB } from "#shared/database/reputation-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

type PlayerStats = {
  charism: number
  belkoin: number
  reputation: number,
  meta: string | null,
  displayName: string | null,
  totalPlaytime: number
}

async function getPlayerStats(nickname: string): Promise<PlayerStats> {
  const main = await bisquiteDB
    .selectFrom("CMI_users")
    .leftJoin("playerpoints_username_cache", "CMI_users.username", "playerpoints_username_cache.username")
    .leftJoin("playerpoints_points", "playerpoints_points.uuid", "playerpoints_username_cache.uuid")
    .select([
      "Balance",
      "UserMeta",
      "playerpoints_points.points",
      "CMI_users.player_uuid",
      "CMI_users.TotalPlayTime",
      "CMI_users.DisplayName"
    ])
    .where("CMI_users.username", "=", nickname)
    .executeTakeFirst()

  if (!main) {
    return {
      charism: 0, meta: null, belkoin: 0, reputation: 0, displayName: null, totalPlaytime: 0
    }
  }

  const reputation = await reputationDB
    .selectFrom("reputation")
    .select("reputation")
    .where("reputation.uuid", "=", main.player_uuid)
    .executeTakeFirst()

  return {
    charism: main.Balance ? Number(main.Balance.toFixed(2)) : 0,
    meta: main.UserMeta,
    belkoin: main.points ? Number(main.points.toFixed(2)) : 0,
    reputation: reputation?.reputation ? reputation.reputation : 0,
    displayName: main.DisplayName,
    totalPlaytime: main.TotalPlayTime ?? 0
  }
}

export const getPlayerStatsRoute = new Hono()
  .get("/get-player-stats/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const stats = await getPlayerStats(nickname)

      return ctx.json({ data: stats }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })