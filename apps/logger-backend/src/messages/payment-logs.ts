import { format } from "gramio";
import { SendLogsPaymentData } from "../utils/send-logs";
import dayjs from "dayjs";

type PaymentLogsMessage = SendLogsPaymentData

export const paymentLogsMessage = ({
  telegramId, orderId, item, nickname
}: PaymentLogsMessage) => {
  const date = dayjs(item).format('HH:mm:ss YYYY-MM-DD')

  return format`Аккаунт ${nickname} приобрел ${item} (${telegramId ?? `undefined`})
      
  Order: ${orderId}
  item: ${item}
`;
}