import { messageHandler } from './lib/handlers/message-handler.ts'
import { fasberryBot, loggerBot } from './shared/bot/bot.ts'
import { pgListenConnect } from './shared/events/listener.ts'
import { initNats } from '@repo/config-nats/nats-client.ts';
import { subscribeReceivePayment } from './subscribers/sub-receive-payment.ts';
import { subscribeReceiveServerCommand } from './subscribers/sub-receive-server-command.ts';
import { subscribeUpdateDonateForPlayer } from './subscribers/sub-update-donate-for-player.ts';
import { subscribeServerEvents } from './subscribers/sub-server-events.ts';
import { subscribeReceiveNotify } from './subscribers/sub-receive-notify.ts';

async function startNatsSubscribers() {
  await subscribeReceivePayment()
  await subscribeReceiveServerCommand()
  await subscribeUpdateDonateForPlayer()
  await subscribeReceiveNotify()
  await subscribeServerEvents()
}

async function loadBotsCommands() {
  await import("./lib/commands/broadcast-command.ts")
  await import("./lib/commands/weather-command.ts")
  await import("./lib/commands/keyboard-command.ts")
  await import("./lib/commands/give-item-command.ts")
}

async function createServer() {
  await fasberryBot.init()
  await loggerBot.start()

  await loadBotsCommands()
  loggerBot.on("message", messageHandler);

  await pgListenConnect()
  await initNats()
  await startNatsSubscribers()
}

createServer()