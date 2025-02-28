import { getNatsConnection } from '@repo/config-nats/nats-client.ts';
import { LOGS_PAYMENT_SUBJECT } from '@repo/shared/constants/nats-subjects';
import { getBuyerTelegramId } from '../lib/queries/get-buyer-telegram-id';
import { sendTelegramMessageToBuyer } from '../utils/send-message-to-buyer';
import { sendLogs } from '../utils/send-logs';

type NotifyPaymentReceived = {
  item: string,
  nickname: string,
  orderId: string
}

export const nofifyPaymentReceived = async (data: NotifyPaymentReceived) => {
  const { item, nickname, orderId } = data;

  const buyerTelegramId = await getBuyerTelegramId(nickname)

  await Promise.all([
    sendTelegramMessageToBuyer({
      item, nickname, orderId, telegramId: buyerTelegramId,
    }),
    sendLogs({
      data: { orderId, item, nickname, telegramId: buyerTelegramId }
    }),
  ]);
};

export function subscribeReceivePayment() {
  const nc = getNatsConnection()

  return nc.subscribe(LOGS_PAYMENT_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const payment = msg.json<NotifyPaymentReceived>()

      if (!payment) return;

      try {
        await nofifyPaymentReceived(payment)
      } catch (error) {
        console.error(error);
      }
    }
  })
}