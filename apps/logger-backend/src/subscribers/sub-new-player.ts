import { getNatsConnection } from "@repo/config-nats/nats-client"
import { sendInLoggerBot } from "../utils/send-logs"
import { FORUM_USER_REGISTER_SUBJECT } from "@repo/shared/constants/nats-subjects"
import dayjs from "@repo/lib/constants/dayjs-instance"
import { bold, format } from "gramio"
import { logger } from "@repo/lib/utils/logger"

export const subscribeNewPlayer = () => {
  const nc = getNatsConnection()

  return nc.subscribe(FORUM_USER_REGISTER_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        logger.error(err.message);
        return;
      }

      const nickname: string = new TextDecoder().decode(msg.data)

      if (!nickname || !nickname.length) return;

      const formattedMessage = format`
        #minecraft #new-player 
        
        👤 Новый игрок: ${bold(`${nickname}`)} в ${dayjs().format('HH:mm:ss YYYY-MM-DD')}
      `

      try {
        await sendInLoggerBot({ text: formattedMessage, type: "log" })
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message)
        }
      }
    }
  })
}