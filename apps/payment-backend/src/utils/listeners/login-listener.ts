import dayjs from 'dayjs';
import { loggerBot } from '#shared/bot.ts';
import { format } from '@gramio/format';
import { subscriber } from '#lib/db/listener.ts';
import { adminTelegramUserId } from '#shared/ids.ts';

type LoginDatePayload = {
  nickname: string,
  uuid: string,
  logindate: number
}

const convertMsToDate = (timestamp: number)  => dayjs(timestamp).format('HH:mm:ss YYYY-MM-DD');

subscriber.notifications.on('logindate_channel', async (payload: LoginDatePayload) => {
  if (payload) {
    const { nickname, logindate, uuid } = payload;
    
    const text = format`[Вход] ${nickname} зашел в игру в ${convertMsToDate(logindate)}`
    
    return await loggerBot.api.sendMessage({ chat_id: adminTelegramUserId, text })
  }
});