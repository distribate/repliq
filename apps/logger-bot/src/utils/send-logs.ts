import { format, FormattableString, spoiler } from '@gramio/format';
import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema.ts';
import { convertDate } from '#helpers/convert-date';
import { loggerBot } from '#shared/bot';
import { adminTelegramUserId } from '#shared/ids';

type SendLogsPunishData = {
  initiator: string,
  recipient: string
}

type SendLogsAccountData = {
  nickname: string,
  logindate: number,
  uuid: string
}

type PaymentData = Pick<PaymentCompleted, "data">["data"]

type SendLogsPaymentData = Omit<PaymentData, "meta"> & {
  meta: {
    nickname: PaymentData["meta"]["nickname"],
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

function capitalizeFirstLetter(str: string) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function sendLogs({
  data, messageType,
}: SendLogs) {
  const { tag } = messageType;
  let message: FormattableString | null = null;
  
  if ('orderId' in data) {
    const { status, customer, amount, currency, orderId, meta, createdAt, telegramId, uuid, testnet, txn, captured } = data;
    const { donate, nickname } = meta;
    
    message = format`Аккаунт ${nickname} приобрел ${donate} за ${amount} ${currency} (${telegramId ?? `undefined`})
      
      Order: ${orderId}
      UUID: ${uuid}
      TXN.HASH: ${txn.hash}
      TXN.LT: ${txn.lt}
      Captured: ${captured}
      Testnet: ${testnet}
      Status: ${capitalizeFirstLetter(status)}
      Адрес кошелька: ${customer.wallet}
      Создан: ${convertDate(createdAt)}
    `;
  }
  
  if ('nickname' in data) {
    const { nickname, logindate, uuid } = data;

    message = format`[Вход] ${nickname} зашел в игру в ${convertDate(logindate)}
    
      ${spoiler(uuid)}
    `;
  }
  
  if ('recipient' in data) {
  
  }
  
  if (!message) return;
  
  const text = format`#${tag} ${message}`;
  
  return await loggerBot.api.sendMessage({ chat_id: adminTelegramUserId, text });
}