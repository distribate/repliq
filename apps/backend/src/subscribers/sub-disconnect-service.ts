import { getNatsConnection } from "@repo/config-nats/nats-client"
import { bold, format } from "gramio"
import { logger } from "@repo/shared/utils/logger.ts"
import { DISCONNECT_SOCIAL_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { repliqBot } from "../shared/bots/index.ts"

type DisconnectServicePayload = { 
  serviceId: string, 
  nickname: string, 
  status: "success" | "error" 
}

export const subscribeDisconnectService = () => {
  const nc = getNatsConnection()

  return nc.subscribe(DISCONNECT_SOCIAL_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        logger.error(err.message);
        return;
      }

      const payload: DisconnectServicePayload = JSON.parse(new TextDecoder().decode(msg.data))
      if (!payload) return;

      const text = format`Телеграм-аккаунт был отвязан от пользователя ${bold(payload.nickname)}.`

      try {
        const chat_id = Number(payload.serviceId)
        await repliqBot.api.sendMessage({ chat_id, text })
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message)
        }
      }
    }
  })
}