import { getNatsConnection } from "@repo/config-nats/nats-client"
import { throwError } from "@repo/lib/helpers/throw-error"
import { USER_GET_STATS_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { Hono } from "hono"

type PlayerStats = {
  charism: number
  belkoin: number
  reputation: number,
  meta: string | null,
  displayName: string | null,
  totalPlaytime: number
}

async function getPlayerStats(nickname: string) {
  const nc = getNatsConnection()

  const res = await nc.request(USER_GET_STATS_SUBJECT + "."+ nickname, "", { timeout: 7000 })
  const data = res.json<PlayerStats>()

  return data
}

export const getUserGameStatsRoute = new Hono()
  .get("/get-user-game-stats/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const stats = await getPlayerStats(nickname)

      return ctx.json({ data: stats }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })