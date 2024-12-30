import { bold, expandableBlockquote, format } from '@gramio/format';

type PaymentReceivedMessage = {
  nickname: string,
  amount: number,
  currency: string,
  createdAt: string,
  orderId: string,
  wallet: string,
  status: string,
  donate: string
}

export const paymentReceivedMessage = ({
  wallet, amount, currency, orderId, createdAt, nickname, donate, status,
}: PaymentReceivedMessage) => {
  return format`
  ⭐ Привет ${nickname}!

  Вы приобрели привилегию ${bold(`${donate}`)} за ${amount} ${currency}

  Детали заказа:
  ${expandableBlockquote(
    `Идентификатор: ${orderId}
Создан: ${createdAt}
Статус: ${status}
Никнейм: ${nickname}
Товар: привилегия ${donate}
Кол-во: 1
Цена: ${amount} ${currency}
Адрес покупателя: ${wallet}
`)}
  ${bold`Приятной игры!`}
  `;
};