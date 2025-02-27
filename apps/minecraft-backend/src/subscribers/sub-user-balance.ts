import { bisquiteDB } from "#shared/database/bisquite-db.ts";
import { playerPointsDB } from "#shared/database/playerpoints-db.ts"
import { getNatsConnection } from "@repo/config-nats/nats-client"

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
    charism: Math.round(charism?.Balance ?? 0),
    belkoin: Math.round(belkoin?.points ?? 0)
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
          return msg.respond(JSON.stringify({ charism: 0, belkoin: 0 }));
        }

        return msg.respond(JSON.stringify(balance))
      } catch (e) {
        console.error(e)
      }
    }
  })
}