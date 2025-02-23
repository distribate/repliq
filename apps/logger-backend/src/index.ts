import { messageHandler } from './lib/handlers/message-handler.ts'
import { fasberryBot, loggerBot } from './shared/bot/bot.ts'
import { pgListenConnect } from './shared/events/listener.ts'
import { initNats } from '@repo/config-nats/nats-client.ts';
import { subscribeReceivePayment } from './subscribers/sub-receive-payment.ts';
import { subscribeReceiveServerCommand } from './subscribers/sub-receive-server-command.ts';
// import { subscribePlayerGroup } from './subscribers/sub-player-group.ts';
import { subscribeServerEvents } from './subscribers/sub-server-events.ts';
import { subscribeReceiveNotify } from './subscribers/sub-receive-notify.ts';
import { subscribeReceiveFiatPayment } from './subscribers/sub-receive-fiat-payment.ts';
import "./lib/commands/broadcast-command.ts"
import "./lib/commands/weather-command.ts"
import "./lib/commands/keyboard-command.ts"
import "./lib/commands/give-item-command.ts"
import { subscribeReferalReward } from './subscribers/sub-referal-reward.ts';

await initNats()

async function startNatsSubscribers() {
  subscribeReceivePayment()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to payment status")
  
  subscribeReceiveServerCommand()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to server command")

  subscribeReceiveFiatPayment()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to fiat payment")

  subscribeReceiveNotify()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to receive notify")

  subscribeServerEvents()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to server events")

  subscribeReferalReward()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to referal reward")
}

await fasberryBot.init()
await loggerBot.start()

loggerBot.on("message", messageHandler);

pgListenConnect()

await startNatsSubscribers()