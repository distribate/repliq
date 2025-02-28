import { forumDB } from "#shared/database/forum-db.ts";
import { callServerCommand } from "#utils/call-command.ts";
import { validateReferal } from "#utils/validate-referal.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_REFERAL_CHECK_SUBJECT } from "@repo/shared/constants/nats-subjects";

export const subscribeRefferalCheck = () => {
  const nc = getNatsConnection()

  return nc.subscribe(USER_REFERAL_CHECK_SUBJECT, {
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

          const update = await trx
            .updateTable("refferals")
            .set({ completed: true })
            .where(eb =>
              eb.and([
                eb("initiator", "=", result.initiator),
                eb("recipient", "=", result.recipient)
              ])
            )
            .executeTakeFirstOrThrow()

          console.log(update.numUpdatedRows > 0 ? "updated" : "not updated")
        })
      } catch (e) {
        console.error(e)
      }
    }
  })
}