import { format, FormattableString } from '@gramio/format';
import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema.ts';
import { loggerBot } from '../shared/bot/bot.ts';
import { AdminsWithDetails, getAdmins } from '../lib/queries/get-admins.ts';
import { paymentLogsMessage } from '../messages/payment-logs.ts';
import { loginLogsMessage } from '../messages/login-logs.ts';

type SendLogsPunishData = {
  initiator: string,
  recipient: string
}

export type SendLogsAccountData = {
  nickname: string,
  logindate: number,
  uuid: string
}

export type PaymentData = Pick<PaymentCompleted, "data">["data"]

export type SendLogsPaymentData = Omit<PaymentData, "meta"> & {
  meta: {
    nickname: PaymentData["meta"]["nickname"],
    donate: string
  },
  telegramId: string | null
}

type MessageType = 'shop' | 'punish' | 'account'

type SendLogsData<T extends MessageType> =
  T extends 'shop' ? SendLogsPaymentData :
  T extends 'punish' ? SendLogsPunishData :
  T extends 'account' ? SendLogsAccountData :
never;

export async function sendLogs<T extends MessageType>({
  data
}: {
  data: SendLogsData<T>
}) {
  let message: FormattableString | null = null;
  let messageType: MessageType | null = null

  if ('orderId' in data) {
    messageType = "shop"
    message = paymentLogsMessage(data);
  }
  
  if ('nickname' in data) {
    messageType = "account"
    message = loginLogsMessage(data);
  }
  
  if ('recipient' in data) {
     messageType = "punish"
  }
  
  if (!message) return;
  
  const text = format`#${messageType ?? ""} ${message}`;
  
  const adminsData = await getAdmins()

  const admins = adminsData.filter(
    (item): item is AdminsWithDetails => item.telegram_id !== null
  )

  for (const { telegram_id } of admins) {
    if (!telegram_id) continue
    await loggerBot.api.sendMessage({ chat_id: telegram_id, text });
  }
}