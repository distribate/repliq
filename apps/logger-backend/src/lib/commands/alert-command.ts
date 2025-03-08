import { bold, format } from "gramio";
import { loggerBot } from "../../shared/bot/bot";
import { validateRequest } from "../../utils/validate-request";
import { pushNotificationOnClient } from "@repo/lib/utils/push-notifications-on-client"
import { getOnlineUsersCount } from "../queries/get-online-user-count";

loggerBot.command('notify', async (ctx) => {
  if (!ctx.from) return;

  const userId = ctx.from.id
  const isAdmin = await validateRequest(userId);

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