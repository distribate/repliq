import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema';
import { getDonateDetails } from '#queries/get-donate-details';
import { getBuyerTelegramId } from '#queries/get-buyer-telegram-id';
import { sendLogs } from '#utils/send-logs';
import { callAlert } from '#lib/rcon-server/call-alert';
import { sendTelegramMessageToBuyer } from '#utils/send-message-to-buyer';

export const nofifyPaymentReceived = async(data: PaymentCompleted['data']) => {
  const { status, customer, orderId, meta, createdAt, currency, txn, captured, uuid, testnet, amount, } = data;
  const { donate: origin, nickname } = meta;
  
  const [donateDetails, buyerTelegramId] = await Promise.all([
    getDonateDetails({ origin }),
    getBuyerTelegramId(nickname)
  ])
  
  const { title: donateTitle } = donateDetails;
  
  return await Promise.all([
    sendTelegramMessageToBuyer({
      amount, status, createdAt, customer, currency, orderId,
      meta: { nickname, donate: donateTitle, },
      telegramId: buyerTelegramId,
    }),
    sendLogs({
      data: {
        amount, status, createdAt, customer, currency, orderId,
        meta: { donate: donateTitle, nickname, },
        telegramId: buyerTelegramId ?? null,
        testnet, uuid, txn, captured
      },
      messageType: {
        tag: 'shop',
      },
    }),
    callAlert(
      `Игрок ${nickname} купил привилегию ${donateTitle}`
    ),
  ]);
};