import { callBroadcast } from "#lib/rcon-server/call-broadcast"
import { loggerBot } from "#shared/bot"

loggerBot.command('broadcast', async (ctx) => {
  if (!ctx.args) {
    return ctx.send('Укажите текст объявления')
  }

  await callBroadcast(ctx.args)
  ctx.reply('Объявление отправлено!')
})