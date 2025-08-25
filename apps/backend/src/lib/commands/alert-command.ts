import { bold, Bot, format } from "gramio";
import { validateRequest } from "../../utils/validate-request.ts";
import { forumDB } from "../../shared/database/forum-db"
import { pushNotificationOnClient } from "#utils/push-notifications-on-client.ts";

async function getOnlineUsersCount() {
  const query = await forumDB
    .selectFrom("users_status")
    .select("id")
    .where("created_at", ">", new Date(Date.now() - 5 * 60 * 1000))
    .execute()

  return query.length
}

export function alertCommand(bot: Bot) {
  bot.command('notify', async (ctx) => {
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
}