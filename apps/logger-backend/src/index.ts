import { receiveServerCommandSub } from './lib/subs/receive-server-command-sub.ts';
import { receivePaymentSub } from './lib/subs/receive-payment-sub.ts';
import { messageHandler } from './lib/handlers/message-handler.ts'
import { fasberryBot, loggerBot } from './shared/bot.ts'
import { pgListenConnect } from './shared/listener.ts'
import { initializeNatsClient } from '@repo/config-nats/nats-client.ts'

async function start() {
  await fasberryBot.init()
  await loggerBot.start()
  await pgListenConnect()
  const nc = await initializeNatsClient()
  
  await receivePaymentSub(nc)
  await receiveServerCommandSub(nc)

  async function loadCommands() {
    await import("./lib/commands/broadcast-command.ts")
    await import("./lib/commands/weather-command.ts")
    await import("./lib/commands/keyboard-command.ts")
  }
  
  loadCommands()
  loggerBot.on("message", messageHandler);
}

start()