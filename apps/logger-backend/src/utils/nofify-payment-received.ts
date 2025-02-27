import { getBuyerTelegramId } from "../lib/queries/get-buyer-telegram-id";
import { sendTelegramMessageToBuyer } from "./send-message-to-buyer";
import { sendLogs } from "./send-logs";
import { callBroadcast } from "./call-broadcast";

type NotifyPaymentReceived = {
  item: string,
  nickname: string,
  orderId: string
}

export const nofifyPaymentReceived = async (data: NotifyPaymentReceived) => {
  const { item, nickname, orderId } = data;

  const buyerTelegramId = await getBuyerTelegramId(nickname)

  const broadcastMsg = `Игрок ${nickname} приобрел ${item}`

  return Promise.all([
    sendTelegramMessageToBuyer({
      item, nickname, orderId, telegramId: buyerTelegramId,
    }),
    sendLogs({
      data: {
        orderId, item, nickname, telegramId: buyerTelegramId
      }
    }),
    callBroadcast(broadcastMsg),
  ]);
};