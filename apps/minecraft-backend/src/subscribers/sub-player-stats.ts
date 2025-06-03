import { bisquiteDB } from "#shared/database/bisquite-db.ts"
import { reputationDB } from "#shared/database/reputation-db.ts"
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { natsLogger } from "@repo/lib/utils/logger"
import { USER_GET_STATS_SUBJECT } from "@repo/shared/constants/nats-subjects"

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

export const subscribePlayerStats = () => {
  const nc = getNatsConnection()

  natsLogger.success("Subscribed to player stats")

  try {
    return nc.subscribe(USER_GET_STATS_SUBJECT + ".*", {
      callback: async (err, msg) => {
        if (err) {
          console.error(err)
          return
        }

        const subject = msg.subject
        const nickname = subject.split(".")[3]

        if (!nickname) {
          return msg.respond(JSON.stringify({
            error: "Invalid nickname"
          }))
        }

        try {
          const start = performance.now();

          const stats = await getPlayerStats(nickname)

          const end = performance.now();

          console.log(`Request time: ${end - start}ms`)

          return msg.respond(JSON.stringify(stats))
        } catch (e) {
          console.error(e)
        }
      }
    })
  } catch (e) {
    // @ts-expect-error
    natsLogger.error(e.message)
  }
}