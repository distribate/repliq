import { paymentReceivedMessage } from "../messages/payment-received.ts"
import { fasberryBot } from "../shared/bot/bot.ts"

type SendTelegramMessageToBuyer = {
  item: string,
  orderId: string,
  telegramId: string | null,
  nickname: string,
}

export async function sendTelegramMessageToBuyer({
  telegramId, item, orderId, nickname
}: SendTelegramMessageToBuyer) {
  if (!telegramId) return;

  const text = paymentReceivedMessage({
    item, orderId, nickname,
  })

  const sendedMessage = await fasberryBot.api.sendMessage({
    chat_id: telegramId, text,
  });

  const { chat, message_id } = sendedMessage;

  return await fasberryBot.api.setMessageReaction({
    chat_id: chat.id,
    message_id,
    is_big: false,
    reaction: [{ emoji: '🎉', type: 'emoji' }],
  });
}