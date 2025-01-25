import type { PaymentCompleted } from "@repo/types/schemas/payment/payment-schema"
import type { PaymentDonateType } from "@repo/types/entities/payment-types"
import { getBuyerTelegramId } from "../lib/queries/get-buyer-telegram-id";
import { getDonateDetails } from "../lib/queries/get-donate-details";
import { sendTelegramMessageToBuyer } from "./send-message-to-buyer";
import { sendLogs } from "./send-logs";
import { callBroadcast } from "./call-broadcast";

export const nofifyPaymentReceived = async(data: PaymentCompleted['data']) => {
  const { 
    status, customer, orderId, meta, createdAt, currency, txn, captured, uuid, testnet, amount 
  } = data;
  
  const { paymentType, paymentValue, nickname } = meta;
  
  switch(paymentType) {
    case 'donate':
      const [ donateDetails, buyerTelegramId ] = await Promise.all([
        getDonateDetails({ origin: paymentValue as PaymentDonateType }),
        getBuyerTelegramId(nickname),
      ]);
      
      const { title: donateTitle } = donateDetails;
      
      const broadcastMsg = `Игрок ${nickname} купил привилегию ${donateTitle}`

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
        }),
        callBroadcast(broadcastMsg),
      ]);
    case 'charism':
      break;
    case 'belkoin':
      break;
  }
};