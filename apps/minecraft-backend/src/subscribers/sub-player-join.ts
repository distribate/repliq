import { bisquiteDB } from "#shared/database/bisquite-db.ts"
import { forumDB } from "#shared/database/forum-db.ts"
import { callServerCommand } from "#utils/call-command.ts"
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { z } from "zod"

const userEventSchema = z.object({
  date: z.string(),
  nickname: z.string(),
  event: z.enum(["join", "quit"])
})

// test min playtime = 5 minutes
// const TEST_MIN_PLAYTIME = 5 * 60 * 1000

// min playtime for reward //
// 3 hours
const MIN_PLAYTIME_FOR_RECIPIENT = 3 * 60 * 60 * 1000
// 6 hours
const MIN_PLAYTIME_FOR_INITIATOR = 6 * 60 * 60 * 1000

async function validateReferal(nickname: string) {
  const queryRefferals = await forumDB
    .selectFrom("refferals")
    .selectAll()
    .where(eb =>
      eb.or([
        eb("initiator", "=", nickname),
        eb("recipient", "=", nickname)
      ])
    )
    .where("completed", "=", false)
    .executeTakeFirst()

  if (!queryRefferals) return null;

  const queryPlaytime = await bisquiteDB
    .selectFrom("CMI_users")
    .select(["TotalPlayTime", "username"])
    .where(eb =>
      eb.or([
        eb("username", "=", queryRefferals.recipient),
        eb("username", "=", queryRefferals.initiator)
      ])
    )
    .execute()

  if (!queryPlaytime || queryPlaytime.length < 2) {
    return null;
  }

  const initiatorPlaytime = queryPlaytime.find(
    p => p.username === queryRefferals.initiator
  )

  const recipientPlaytime = queryPlaytime.find(
    p => p.username === queryRefferals.recipient
  )

  if (!initiatorPlaytime?.TotalPlayTime || !recipientPlaytime?.TotalPlayTime) {
    return null;
  }

  let isPlaytimeValid: boolean = false;

  if (initiatorPlaytime.TotalPlayTime > MIN_PLAYTIME_FOR_INITIATOR) {
    if (recipientPlaytime.TotalPlayTime > MIN_PLAYTIME_FOR_RECIPIENT) {
      isPlaytimeValid = true;
    }
  }

  console.log(`playtime for ${queryRefferals.initiator} and ${queryRefferals.recipient} is ${isPlaytimeValid}`)

  if (!isPlaytimeValid) return null;

  return { initiator: queryRefferals.initiator, recipient: queryRefferals.recipient }
}

export const subscribeRefferalCheck = () => {
  const nc = getNatsConnection()

  return nc.subscribe("users.referal.check", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const nickname: string = new TextDecoder().decode(msg.data)

      if (!nickname) return;

      try {
        const result = await validateReferal(nickname)

        if (!result) return;

        await forumDB.transaction().execute(async (trx) => {
          await Promise.all([
            // for initiator
            callServerCommand({ parent: "cmi", value: `money give ${result.initiator} 60` }),
            callServerCommand({ parent: "p", value: `give ${result.initiator} 5` }),
            // for recipient
            callServerCommand({ parent: "cmi", value: `money give ${result.recipient} 30` }),
            callServerCommand({ parent: "p", value: `give ${result.recipient} 1` })
          ])

          const s = await trx
            .updateTable("refferals")
            .set({ completed: true })
            .where(eb =>
              eb.and([
                eb("initiator", "=", result.initiator),
                eb("recipient", "=", result.recipient)
              ])
            )
            .executeTakeFirstOrThrow()

          console.log(s.numUpdatedRows > 0 ? "updated" : "not updated")
        })
      } catch (e) {
        console.error(e)
      }
    }
  })
}

export const subscribePlayerJoin = () => {
  const nc = getNatsConnection()

  return nc.subscribe(SERVER_USER_EVENT_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const payload = JSON.parse(new TextDecoder().decode(msg.data))

      const { success, data, error } = userEventSchema.safeParse(payload)

      if (error) {
        console.error(error);
      }

      if (!success) return;

      try {
        switch (data.event) {
          case "join":
            nc.publish("users.referal.check", new TextEncoder().encode(data.nickname))
            break;
          default:
            break;
        }
      } catch (e) {
        console.error(e)
      }
    }
  })
}