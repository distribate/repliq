import { getNatsConnection } from "@repo/config-nats/nats-client"
import { LOGS_ADMIN_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { sendInLoggerBot } from "../lib/modules/send-logs"
import * as z from "zod"
import { format, FormattableString } from "gramio"
import { logger } from "@repo/shared/utils/logger.ts"
import dayjs from "@repo/shared/constants/dayjs-instance"

const payloadType = z.enum([
  "register",
  "login"
])

const payloadSchema = z.object({
  type: payloadType,
  data: z.object({
    nickname: z.string()
  })
})

function getRegisterMessage(nickname: string) {
  return format`
  #auth #register
  ${nickname} зарегистрировался в ${dayjs().format("HH:mm:ss YYYY-MM-DD")}
  `
}

function getLoginMessage(nickname: string) {
  return format`
  #auth #login
  ${nickname} авторизовался в ${dayjs().format("HH:mm:ss YYYY-MM-DD")}
  `
}

export const subscribeAdminLog = () => {
  const nc = getNatsConnection()

  return nc.subscribe(LOGS_ADMIN_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        logger.error(err.message)
        return;
      }

      const result = payloadSchema.safeParse(msg.json());
      
      if (!result.success) {
        console.error(result.error)
        return;
      }
      
      const { type, data } = result.data

      try {
        let text: FormattableString | null = null;

        switch (type) {
          case "register":
            text = getRegisterMessage(data.nickname)
            break;
          case "login":
            text = getLoginMessage(data.nickname)
            break;
          default:
            break
        }

        if (!text) return;

        await sendInLoggerBot({ text, type: "admins" })
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message)
        }
      }
    }
  })
}