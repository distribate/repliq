import { bold, Bot, format } from "gramio";
import { validateAdminRequest } from "../validators/validate-admin-request.ts";
import { pushNotificationOnClient } from "#lib/modules/push-notifications-on-client.ts";
import { getRedisClient } from "#shared/redis/init.ts";

async function getOnlineUsersCount() {
  const redis = getRedisClient();
  const count = await redis.zcard("users:last_activity_zset");
  return count
}

export function alertCommand(bot: Bot) {
  bot.command('notify', async (ctx) => {
    if (!ctx.from) return;

    const userId = ctx.from.id
    const isAdmin = await validateAdminRequest(userId);

    if (!isAdmin) {
      return ctx.reply('У вас нет доступа к этой команде');
    }

    if (!ctx.args) {
      return ctx.send('Укажите текст уведомления')
    }

    pushNotificationOnClient({
      event: "global",
      data: { message: ctx.args }
    })

    const onlineUsersCount = await getOnlineUsersCount() ?? 0

    const message = format`
    Отправлено сообщение ${ctx.args}

    Сообщение получат приблизительно ${bold(onlineUsersCount)} пользователей
  `

    return ctx.reply(message)
  })
}