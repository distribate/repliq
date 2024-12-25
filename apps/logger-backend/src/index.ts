import { messageHandler } from '#lib/handlers/message-handler'
import { fasberryBot, loggerBot } from '#shared/bot'
import { pgListenConnect } from '#shared/listener'
import { startNATS } from '#shared/nats-client'

await fasberryBot.init()
await loggerBot.start()
await pgListenConnect()
await startNATS()

async function loadCommands() {
  await import("#lib/commands/broadcast-command")
  await import("#lib/commands/weather-command"),
  await import("#lib/commands/keyboard-command")
}

loadCommands()
loggerBot.on("message", messageHandler);