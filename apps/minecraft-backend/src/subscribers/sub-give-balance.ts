import { playerPointsDB } from "#shared/database/playerpoints-db.ts"
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { sql } from "kysely"

export const subscribeGiveBalance = () => {
  const nc = getNatsConnection()

  return nc.subscribe("give.balance", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err)
        return
      }

      const nickname: string = msg.data.toString()

      try {
        const res = await playerPointsDB
          .updateTable("playerpoints_points")
          .set({ points: sql`points + 5` })
          .where("uuid", "=", 
            playerPointsDB
              .selectFrom("playerpoints_username_cache")
              .select("uuid")
              .where("username", "=", nickname)
          )
          .executeTakeFirstOrThrow()

        if (res.numUpdatedRows) {
          return msg.respond(JSON.stringify({ result: "ok" }))
        }

        return msg.respond(JSON.stringify({ error: "not updated" }))
      } catch (e) {
        console.error(e)
      }
    }
  })
}