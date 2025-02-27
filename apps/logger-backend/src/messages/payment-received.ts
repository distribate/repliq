import { bold, expandableBlockquote, format } from '@gramio/format';

type PaymentReceiveMessage = {
  item: string,
  nickname: string,
  orderId: string
}

export const paymentReceivedMessage = ({
  item, nickname, orderId
}: PaymentReceiveMessage) => {
  return format`
  ⭐ Привет ${nickname}!

  Вы приобрели ${bold(`${item}`)}

  Детали заказа:
  ${expandableBlockquote(
    `Идентификатор: ${orderId}
Никнейм: ${nickname}
Товар: ${item}
`)}
  ${bold`Приятной игры!`}
  `;
};