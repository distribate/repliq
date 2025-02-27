import { getNatsConnection } from "@repo/config-nats/nats-client"
import { sendInLoggerBot } from "../utils/send-logs"
import { FORUM_USER_REGISTER_SUBJECT } from "@repo/shared/constants/nats-subjects"
import dayjs from "@repo/lib/constants/dayjs-instance"
import { bold, format } from "gramio"

export const subscribeNewPlayer = () => {
  const nc = getNatsConnection()

  return nc.subscribe(FORUM_USER_REGISTER_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const nickname: string = new TextDecoder().decode(msg.data)

      if (!nickname || nickname.length === 0) return;

      const now = new Date()
      const formatted = dayjs(now).format('HH:mm:ss YYYY-MM-DD')
      const formattedByNow = dayjs(now).fromNow()

      const formattedMessage = format`👤 Новый игрок: ${bold(`${nickname}`)} в ${formatted} (${formattedByNow})`

      try {
        await sendInLoggerBot({
          text: formattedMessage,
          type: "log"
        })
      } catch (error) {
        console.error(error);
      }
    }
  })
}