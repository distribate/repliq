import { getNatsConnection } from "@repo/config-nats/nats-client.ts"
import { SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects.ts"
import { validateRequest } from "../../utils/validate-request.ts"
import { Bot } from "gramio"

const weatherTitle: Record<WeatherType, string> = {
  rain: 'дождливая',
  sun: 'солнечная',
  storm: 'штормовая',
}

const weatherEmojis: Record<WeatherType, string> = {
  rain: '🌧️',
  sun: '🌞',
  storm: '🌩️',
} as const

type WeatherType = 'rain' | 'sun' | 'storm'

export function weatherCommand(bot: Bot) {
  bot.command('weather', async (ctx) => {
    if (!ctx.from) {
      return
    }

    if (ctx.chat.id !== -1002049549066) {
      const userId = ctx.from.id
      const isAdmin = await validateRequest(userId);

      if (!isAdmin) {
        return ctx.reply('У вас нет доступа к этой команде');
      }
    }

    if (!ctx.args) {
      return ctx.send('Укажите тип погоды: rain, sun, storm')
    }

    const username = `${ctx.from?.firstName} ${ctx.from?.lastName ?? ''}`

    const arg = ctx.args as WeatherType

    if (arg !== 'rain' && arg !== 'sun' && arg !== 'storm') {
      return ctx.send('Такого типа погоды не найдено!')
    }

    const value = `weather ${arg} BisquiteWorld`

    const broadcastMsg = `Юзер {#FABBFB}${username} {#FFFFFF}(tg) установил погоду ${weatherTitle[arg]}`
    const serverCommandCallbackMsg = `Установлена погода ${weatherTitle[arg]}! ${weatherEmojis[arg]}`

    const nc = getNatsConnection()

    const res = await nc.request(SERVER_USER_EVENT_SUBJECT, JSON.stringify({
      event: "executeCommand",
      command: `cmi ${value}`
    }))

    const data = res.json<{ result: string } | { error: string }>()

    if ("error" in data) {
      return ctx.reply(data.error)
    }

    ctx.reply(serverCommandCallbackMsg)
  })
}
