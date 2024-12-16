import { subscriber } from '#shared/listener';
import { sendLogs } from '#utils/send-logs';

type LoginDatePayload = {
  nickname: string,
  uuid: string,
  logindate: number
}

subscriber.notifications.on('logindate_channel', async (payload: LoginDatePayload) => {
  if (payload) {
    return await sendLogs({
      data: payload, messageType: { tag: 'account' }
    })
  }
});