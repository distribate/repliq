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

async function startNats() {
  try {
    await initNats()

    subscribeReceivePayment()
    console.log("\x1b[34m[NATS]\x1b[0m Subscribed to payment status")

    subscribeReceiveNotify()
    console.log("\x1b[34m[NATS]\x1b[0m Subscribed to receive notify")

    subscribeServerEvents()
    console.log("\x1b[34m[NATS]\x1b[0m Subscribed to server events")

    subscribeNewPlayer()
    console.log("\x1b[34m[NATS]\x1b[0m Subscribed to new player")

    subscribeAdminLog()
    console.log("\x1b[34m[NATS]\x1b[0m Subscribed to admin log")
  } catch (e) {
    console.error(e)
  }
}

await startNats()

await fasberryBot.init()
await loggerBot.start()

loggerBot.on("message", messageHandler);

// pgListenConnect()