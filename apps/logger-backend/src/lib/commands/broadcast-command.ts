import { getNatsConnection } from "@repo/config-nats/nats-client.ts"
import { loggerBot } from "../../shared/bot/bot.ts"
import { SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects.js"

loggerBot.command('broadcast', async (ctx) => {
  if (!ctx.args) {
    return ctx.send('Укажите текст объявления')
  }

  const nc = getNatsConnection()

  const res = await nc.request(SERVER_USER_EVENT_SUBJECT, JSON.stringify({
    event: "executeCommand",
    command: `cmi broadcast ${ctx.args}`
  }))

  const data = res.json<{ result: string } | { error: string }>()

  if ("error" in data) {
    return ctx.reply(data.error)
  }

  ctx.reply(`Объявление отправлено!, ${data.result}`)
})