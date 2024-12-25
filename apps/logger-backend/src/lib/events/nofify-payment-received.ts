import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema';
import { getDonateDetails } from '#queries/get-donate-details';
import { getBuyerTelegramId } from '#queries/get-buyer-telegram-id';
import { sendLogs } from '#utils/send-logs';
import { callBroadcast } from '#lib/rcon-server/call-broadcast';
import { sendTelegramMessageToBuyer } from '#utils/send-message-to-buyer';
import { PaymentDonateType } from '@repo/types/entities/payment-types';

export const nofifyPaymentReceived = async(data: PaymentCompleted['data']) => {
  const { status, customer, orderId, meta, createdAt, currency, txn, captured, uuid, testnet, amount } = data;
  const { paymentType, paymentValue, nickname } = meta;
  
  switch(paymentType) {
    case 'donate':
      const [ donateDetails, buyerTelegramId ] = await Promise.all([
        getDonateDetails({ origin: paymentValue as PaymentDonateType }),
        getBuyerTelegramId(nickname),
      ]);
      
      const { title: donateTitle } = donateDetails;
      
      return await Promise.all([
        sendTelegramMessageToBuyer({
          amount, status, createdAt, customer, currency, orderId,
          meta: { nickname, donate: donateTitle },
          telegramId: buyerTelegramId,
        }),
        sendLogs({
          data: {
            amount, status, createdAt, customer, currency, orderId,
            meta: { donate: donateTitle, nickname },
            telegramId: buyerTelegramId ?? null,
            testnet, uuid, txn, captured,
          },
          messageType: {
            tag: 'shop',
          },
        }),
        callBroadcast(
          `Игрок ${nickname} купил привилегию ${donateTitle}`,
        ),
      ]);
    case 'charism':
      break;
    case 'belkoin':
      break;
  }
};