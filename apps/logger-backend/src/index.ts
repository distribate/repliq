import { messageHandler } from './lib/handlers/message-handler.ts'
import { fasberryBot, loggerBot } from './shared/bot/bot.ts'
import { pgListenConnect } from './shared/events/listener.ts'
import { initNats } from '@repo/config-nats/nats-client.ts';
import { subscribeReceivePayment } from './subscribers/sub-receive-payment.ts';
import { subscribeReceiveServerCommand } from './subscribers/sub-receive-server-command.ts';
import { subscribePlayerGroup } from './subscribers/sub-player-group.ts';
import { subscribeServerEvents } from './subscribers/sub-server-events.ts';
import { subscribeReceiveNotify } from './subscribers/sub-receive-notify.ts';
import { subscribeReceiveFiatPayment } from './subscribers/sub-receive-fiat-payment.ts';
import "./lib/commands/broadcast-command.ts"
import "./lib/commands/weather-command.ts"
import "./lib/commands/keyboard-command.ts"
import "./lib/commands/give-item-command.ts"

await initNats()

function startNatsSubscribers() {
  subscribeReceivePayment()
  console.log("Subscribed to payment status")
  
  subscribeReceiveServerCommand()
  console.log("Subscribed to server command")

  subscribeReceiveFiatPayment()
  console.log("Subscribed to fiat payment")

  subscribePlayerGroup()
  console.log("Subscribed to player group")

  subscribeReceiveNotify()
  console.log("Subscribed to receive notify")

  subscribeServerEvents()
  console.log("Subscribed to server events")
}

await fasberryBot.init()
await loggerBot.start()

loggerBot.on("message", messageHandler);

pgListenConnect()

startNatsSubscribers()