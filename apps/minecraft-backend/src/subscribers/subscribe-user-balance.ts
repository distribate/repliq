import { cmiDB } from "#shared/database/cmi-db.ts"
import { playerPointsDB } from "#shared/database/playerpoints-db.ts"
import { getNatsConnection } from "@repo/config-nats/nats-client"

async function getUserBalance(nickname: string) {
  const charismQ = await cmiDB
    .selectFrom("cmi_users")
    .select(["Balance", "player_uuid"])
    .where("username", "=", nickname)
    .executeTakeFirst()

  if (!charismQ || !charismQ.player_uuid) {
    return null;
  }

  const belkoinQ = await playerPointsDB
    .selectFrom("playerpoints_points")
    .select("points")
    .where("uuid", "=", charismQ.player_uuid)
    .executeTakeFirst()

  return {
    charism: Math.round(charismQ.Balance ?? 0),
    belkoin: Math.round(belkoinQ?.points ?? 0)
  }
}

export const subscribeUserBalance = () => {
  const nc = getNatsConnection()

  return nc.subscribe("get-user-balance", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const nickname = new TextDecoder().decode(msg.data)

      try {
        const balance = await getUserBalance(nickname)

        if (!balance) {
          return;
        }

        return msg.respond(JSON.stringify(balance))
      } catch (e) {
        console.error(e)
      }
    }
  })
}