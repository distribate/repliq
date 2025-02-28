import { format } from "gramio";
import { SendLogsPaymentData } from "../utils/send-logs";
import dayjs from "dayjs";

type PaymentLogsMessage = SendLogsPaymentData

function capitalizeFirstLetter(str: string) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const paymentLogsMessage = ({
  meta, amount, currency, telegramId, orderId, testnet, captured, txn, uuid, createdAt, customer
}: PaymentLogsMessage) => {
  const date = dayjs(createdAt).format('HH:mm:ss YYYY-MM-DD')

  return format`Аккаунт ${meta.nickname} приобрел ${meta.donate} за ${amount} ${currency} (${telegramId ?? `undefined`})
      
  Order: ${orderId}
  UUID: ${uuid}
  TXN.HASH: ${txn.hash}
  TXN.LT: ${txn.lt}
  Captured: ${captured}
  Testnet: ${testnet}
  Status: ${capitalizeFirstLetter(status)}
  Адрес кошелька: ${customer.wallet}
  Создан: ${date}
`;
}