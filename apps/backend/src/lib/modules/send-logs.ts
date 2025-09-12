import { forumDB } from '#shared/database/forum-db.ts';
import { servicedBot } from '../../shared/bots/index.ts';

type SendLoggerBot = {
  type: "admins" | "log",
  text: string
}

export async function sendInLoggerBot({
  text, type
}: SendLoggerBot) {
  switch (type) {
    case "admins":
      const data = await forumDB
        .selectFrom("admins")
        .innerJoin("users", "admins.user_id", "users.id")
        .select([
          "admins.user_id",
          "admins.telegram_id",
          "users.nickname"
        ])
        .execute();

      const admins = data.filter(
        (item): item is typeof data[number] => item.telegram_id !== null
      )

      for (const { telegram_id } of admins) {
        if (!telegram_id) continue;

        await servicedBot.api.sendMessage({ chat_id: telegram_id, text });
      }

      break;
    case "log":
      await servicedBot.api.sendMessage({ chat_id: "-4007811783", text });

      break;
    default:
      throw new Error()
  }
}