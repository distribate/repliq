import { loggerBot } from "../../shared/bot/bot.ts"
import { callBroadcast } from "../../utils/call-broadcast.ts"

loggerBot.command('broadcast', async (ctx) => {
  if (!ctx.args) {
    return ctx.send('Укажите текст объявления')
  }

  await callBroadcast(ctx.args)
  ctx.reply('Объявление отправлено!')
})