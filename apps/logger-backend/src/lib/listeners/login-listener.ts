import { authSubscriber } from "../../shared/listener.ts"
import { sendLogs } from "../../utils/send-logs.ts"

type LoginDatePayload = {
  nickname: string,
  uuid: string,
  logindate: number
}

export async function notifyByAuthLoginDateChannel() {
  return authSubscriber.notifications.on('auth_logindate_channel', async (payload: LoginDatePayload) => {
    if (payload) {
      return await sendLogs({
        data: payload, messageType: { tag: 'account' }
      })
    }
  });
}