import { getNatsConnection } from "@repo/config-nats/nats-client"
import { LOGS_ADMIN_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { sendInLoggerBot } from "../utils/send-logs"
import { z } from "zod"
import { format, FormattableString } from "gramio"
import dayjs from "@repo/lib/constants/dayjs-instance"

const payloadSchema = z.object({
  type: z.enum(["register"]),
  data: z.object({
    nickname: z.string()
  })
}).superRefine((data, ctx) => {
  if (data.type === "register" && !data.data.nickname) {
    ctx.addIssue({
      code: "custom",
      path: ["data", "nickname"],
      message: "Nickname is required",
    });
  }
})

export const subscribeAdminLog = () => {
  const nc = getNatsConnection()

  return nc.subscribe(LOGS_ADMIN_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err)
        return;
      }

      const payload = msg.json()

      let message: FormattableString | null = null

      const { data, success, error } = payloadSchema.safeParse(payload)

      if (!success) return;

      try {
        switch (data.type) {
          case "register":
            message = format`[Регистрация] ${data.data.nickname} зарегистрировался на проекте в ${dayjs().format("HH:mm:ss YYYY-MM-DD")}`

            await sendInLoggerBot({
              text: message, type: "admins"
            })

            break;
          default:
            break
        }
      } catch (e) {
        console.error(e)
      }
    }
  })
}