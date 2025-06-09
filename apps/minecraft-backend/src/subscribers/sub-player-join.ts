import { getNatsConnection } from "@repo/config-nats/nats-client"
import { SERVER_USER_EVENT_SUBJECT, USER_REFERAL_CHECK_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { z } from "zod/v4"
import dayjs from "@repo/lib/constants/dayjs-instance"
import { natsLogger } from "@repo/lib/utils/logger"

const userJoinSchema = z.object({
  date: z.string(),
  nickname: z.string(),
  event: z.enum(["join", "quit"])
})

export const subscribePlayerJoin = () => {
  const nc = getNatsConnection()

  natsLogger.success("Subscribed to player join")
  return nc.subscribe(SERVER_USER_EVENT_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const payload = JSON.parse(new TextDecoder().decode(msg.data))

      if (!userJoinSchema.shape.event.options.includes(payload.event)) {
        return;
      }

      const { success, data } = userJoinSchema.safeParse(payload)

      if (!success) return;

      try {
        switch (data.event) {
          case "join":
            console.log(`${data.nickname} joined`, dayjs().format("HH:mm:ss YYYY-MM-DD"))

            nc.publish(USER_REFERAL_CHECK_SUBJECT, new TextEncoder().encode(data.nickname))
            break;
          case "quit":
            console.log(`${data.nickname} quit`, dayjs().format("HH:mm:ss YYYY-MM-DD"))

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