import { messageHandler } from './lib/handlers/message-handler.ts'
import { fasberryBot, loggerBot } from './shared/bot/bot.ts'
// import { pgListenConnect } from './shared/events/listener.ts'
import { initNats } from '@repo/config-nats/nats-client.ts';
import { subscribeReceivePayment } from './subscribers/sub-receive-payment.ts';
import { subscribeServerEvents } from './subscribers/sub-server-events.ts';
import { subscribeReceiveNotify } from './subscribers/sub-receive-notify.ts';
import "./lib/commands/broadcast-command.ts"
import "./lib/commands/weather-command.ts"
import "./lib/commands/keyboard-command.ts"
import "./lib/commands/give-item-command.ts"
import "./lib/commands/stats-command.ts"
import "./lib/commands/check-online-command.ts"
import "./lib/commands/alert-command.ts"
import { subscribeNewPlayer } from './subscribers/sub-new-player.ts';
import { subscribeAdminLog } from './subscribers/sub-admin-log.ts';
import { logger, natsLogger } from "@repo/lib/utils/logger.ts"

async function startNats() {
  try {
    await initNats()

    subscribeReceivePayment()
    natsLogger.success("Subscribed to payment status")

    subscribeReceiveNotify()
    natsLogger.success("Subscribed to receive notify")

    subscribeServerEvents()
    natsLogger.success("Subscribed to server events")

    subscribeNewPlayer()
    natsLogger.success("Subscribed to new player")

    subscribeAdminLog()
    natsLogger.success("Subscribed to admin log")
  } catch (e) {
    natsLogger.error(e)
  }
}

await startNats()

await fasberryBot.init()
await loggerBot.start()

loggerBot.on("message", messageHandler);

logger.success("Logger Backend started")
// pgListenConnect()