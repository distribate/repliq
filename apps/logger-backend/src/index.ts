import { messageHandler } from './lib/handlers/message-handler.ts'
import { fasberryBot, loggerBot } from './shared/bot/bot.ts'
import { pgListenConnect } from './shared/events/listener.ts'
import { initNats } from '@repo/config-nats/nats-client.ts';
import { subReceivePayment } from './subscribers/sub-receive-payment.ts';
import { subReceiveServerCommand } from './subscribers/sub-receive-server-command.ts';
import { subUpdateDonateForPlayer } from './subscribers/sub-update-donate-for-player.ts';
import { subReceiveIssue } from './subscribers/sub-receive-issue.ts';
import { subscribeServerEvents } from './subscribers/sub-server-events.ts';

async function startNatsSubscribers() {
  await subReceivePayment()
  await subReceiveServerCommand()
  await subReceiveIssue()
  await subUpdateDonateForPlayer()
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

  await pgListenConnect()
  await initNats()
  await startNatsSubscribers()

  await loadBotsCommands()
  loggerBot.on("message", messageHandler);
}

createServer()
  .then(() => console.log(`Server started on port ${process.env.LOGGER_BACKEND_PORT}'`))
  .catch(err => {
    console.error('Error starting server:', err);
  });