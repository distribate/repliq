import { loggerBot } from '../shared/bots/init.ts';
import { type AdminsWithDetails, getAdmins } from '../lib/queries/get-admins.ts';

type SendLoggerBot = {
  type: "admins" | "log",
  text: any
}

export async function sendInLoggerBot({
  text, type
}: SendLoggerBot) {
  switch (type) {
    case "admins":
      const adminsData = await getAdmins()

      const admins = adminsData.filter(
        (item): item is AdminsWithDetails => item.telegram_id !== null
      )

      for (const { telegram_id } of admins) {
        if (!telegram_id) continue;

        await loggerBot.api.sendMessage({ chat_id: telegram_id, text });
      }

      break;
    case "log":
      await loggerBot.api.sendMessage({ chat_id: "-4007811783", text });

      break;
    default:
      throw new Error()
  }
}