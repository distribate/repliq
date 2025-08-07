import { getNatsConnection } from "@repo/config-nats/nats-client"
import { LOGS_ADMIN_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { sendInLoggerBot } from "../utils/send-logs"
import * as z from "zod"
import { format, FormattableString } from "gramio"
import dayjs from "@repo/lib/constants/dayjs-instance"
import { logger } from "@repo/lib/utils/logger"

const payloadType = z.enum([
  "register"
  // ...
])

const payloadSchema = z.object({
  type: payloadType,
  data: z.object({
    nickname: z.string()
  })
})
// .check((ctx) => {
//   if (ctx.value.type === "register" && !ctx.value.data.nickname) {
//     ctx.issues.push({
//       input: "",
//       code: "custom",
//       path: ["data", "nickname"],
//       message: "Nickname is required",
//     });
//   }
// })

export const subscribeAdminLog = () => {
  const nc = getNatsConnection()

  return nc.subscribe(LOGS_ADMIN_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        logger.error(err.message)
        return;
      }

      const result = payloadSchema.safeParse(msg.json())
      
      if (!result.success) return;
      
      let message: FormattableString | null = null

      const { type, data } = result.data

      try {
        switch (type) {
          case "register":
            message = format`
              #reg 
              
              ${data.nickname} зарегистрировался в ${dayjs().format("HH:mm:ss YYYY-MM-DD")}
            `

            await sendInLoggerBot({ text: message, type: "admins" })

            break;
          default:
            break
        }
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message)
        }
      }
    }
  })
}