import { bold, expandableBlockquote, format } from '@gramio/format';
import { fasberryBot } from '#shared/bot.ts';
import type { PaymentData } from '#routes/check-order.ts';

type SendTelegramMessageToBuyer = PaymentData & {
  telegramId: string | null
}

export async function sendTelegramMessageToBuyer({
  amount, currency, orderId, meta, status, createdAt, customer, telegramId,
}: SendTelegramMessageToBuyer) {
  if (!telegramId) return;
  
  const { donate, nickname } = meta;
  
  const message = format`
  ⭐ Привет ${nickname}!

  Вы приобрели привилегию ${bold(`${donate}`)} за ${amount} ${currency}

  Детали заказа:
  ${expandableBlockquote(
    `Идентификатор: ${orderId}
Создан: ${createdAt}
Статус: ${status}
Никнейм: ${meta.nickname}
Товар: привилегия ${donate}
Кол-во: 1
Цена: ${amount} ${currency}
Адрес покупателя: ${customer.wallet}
`)}
  ${bold`Приятной игры!`}
  `;
  
  const sendedMessage = await fasberryBot.api.sendMessage({
    chat_id: telegramId, text: message,
  });
  
  const { chat, message_id } = sendedMessage;
  
  return await fasberryBot.api.setMessageReaction({
    chat_id: chat.id,
    message_id,
    is_big: false,
    reaction: [ { emoji: '🎉', type: 'emoji' } ],
  });
}