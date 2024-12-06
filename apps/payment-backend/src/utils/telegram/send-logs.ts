import { loggerBot } from '#shared/bot.ts';
import type { PaymentData } from '#routes/check-order.ts';
import { format, FormattableString } from '@gramio/format';
import { adminTelegramUserId } from '#shared/ids.ts';

type SendLogsPunishData = {
  initiator: string,
  recipient: string
}

type SendLogsAccountData = {
  nickname: string
}

type SendLogsPaymentData = Omit<PaymentData, "meta"> & {
  meta: {
    nickname: string,
    donate: string
  },
  telegramId: string | null
}

type SendLogsFormat = {
  tag: 'shop' | 'punish' | 'account'
}

type SendLogs = {
  data: SendLogsPaymentData
    | SendLogsPunishData
    | SendLogsAccountData,
  messageType: SendLogsFormat
}

export async function sendLogs({
  data, messageType,
}: SendLogs) {
  const { tag } = messageType;
  let message: FormattableString | null = null;
  
  if ('orderId' in data) {
    const { status, customer, amount, currency, orderId, meta, createdAt, telegramId } = data;
    const { donate, nickname } = meta;
    
    message = format`Аккаунт ${nickname} приобрел ${donate} за ${amount} ${currency} (${telegramId ?? `undefined`})
      
      ${orderId} / ${status} / ${customer.wallet} / ${createdAt}
    `;
  }
  
  if ('nickname' in data) {
    const { nickname } = data;
    message = format`Аккаунт ${nickname} `;
  }
  
  if ('recipient' in data) {
  
  }
  
  if (!message) return;
  
  const text = format`#${tag} ${message}`;
  
  return await loggerBot.api.sendMessage({ chat_id: adminTelegramUserId, text });
}