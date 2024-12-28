import { callBroadcast } from "../../lib/rcon-server/call-broadcast.ts"
import { callServerCommand } from "../../lib/rcon-server/call-command.ts"
import { loggerBot } from "../../shared/bot.ts"

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

loggerBot.command('weather', async (ctx) => {
  if (!ctx.args) {
    return ctx.send('Укажите тип погоды: rain, sun, storm')
  }

  const username = `${ctx.from?.firstName} ${ctx.from?.lastName ?? ''}`

  const arg = ctx.args as WeatherType

  if (arg !== 'rain' && arg !== 'sun' && arg !== 'storm') {
    return ctx.send('Такого типа погоды не найдено!')
  }

  const value = `weather ${arg} BisquiteWorld`

  await Promise.all([
    callBroadcast(`Юзер {#FABBFB}${username} {#FFFFFF}(tg) установил погоду ${weatherTitle[arg]}`),
    callServerCommand({
      parent: 'cmi',
      value,
    }).then(() => {
      ctx.reply(`Установлена погода ${weatherTitle[arg]}! ${weatherEmojis[arg]}`)
    })
  ])
})
