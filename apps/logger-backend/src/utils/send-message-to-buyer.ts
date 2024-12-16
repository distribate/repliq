import { fasberryBot } from '#shared/bot';
import { paymentReceivedMessage } from '#lib/messages/payment-received';
import { PaymentData } from '@repo/types/schemas/payment/payment-schema';

type SendTelegramMessageToBuyer = Omit<PaymentData, "meta"> & {
  meta: {
    nickname: PaymentData["meta"]["nickname"],
    donate: string
  },
  telegramId: string | null
}

export async function sendTelegramMessageToBuyer({
  amount, currency, orderId, meta, status, createdAt, customer, telegramId,
}: SendTelegramMessageToBuyer) {
  if (!telegramId) return;
  
  const { donate, nickname } = meta;
  
  const text = paymentReceivedMessage({
    status, wallet: customer.wallet, donate, nickname, createdAt, orderId, currency, amount
  })
  
  const sendedMessage = await fasberryBot.api.sendMessage({
    chat_id: telegramId, text,
  });
  
  const { chat, message_id } = sendedMessage;
  
  return await fasberryBot.api.setMessageReaction({
    chat_id: chat.id,
    message_id,
    is_big: false,
    reaction: [ { emoji: '🎉', type: 'emoji' } ],
  });
}