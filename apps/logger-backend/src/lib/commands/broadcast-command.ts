import { callBroadcast } from "../../lib/rcon-server/call-broadcast.ts"
import { loggerBot } from "../../shared/bot.ts"

loggerBot.command('broadcast', async (ctx) => {
  if (!ctx.args) {
    return ctx.send('Укажите текст объявления')
  }

  await callBroadcast(ctx.args)
  ctx.reply('Объявление отправлено!')
})