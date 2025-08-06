import { repliqBot, loggerBot } from './shared/bot/bot.ts'
import { initNats } from '@repo/config-nats/nats-client.ts';
import { subscribeReceivePayment } from './subscribers/sub-receive-payment.ts';
import { subscribeServerEvents } from './subscribers/sub-server-events.ts';
import { subscribeReceiveNotify } from './subscribers/sub-receive-notify.ts';
import { subscribeNewPlayer } from './subscribers/sub-new-player.ts';
import { subscribeAdminLog } from './subscribers/sub-admin-log.ts';
import { logger, natsLogger } from "@repo/lib/utils/logger.ts"
import { broadcastCommand } from "./lib/commands/broadcast-command.ts"
import { weatherCommand } from "./lib/commands/weather-command.ts"
import { keyboardCommand } from "./lib/commands/keyboard-command.ts"
import { giveItemCommand } from "./lib/commands/give-item-command.ts"
import { statsCommand } from "./lib/commands/stats-command.ts"
import { checkOnlineCommand } from "./lib/commands/check-online-command.ts"
import { alertCommand } from "./lib/commands/alert-command.ts"
import { connectUserCommand } from "./lib/commands/connect-command.ts"
import { messageHandler } from "./lib/handlers/message-handler.ts";
import { subscribeDisconnectService } from './subscribers/sub-disconnect-service.ts';

export const commandRegistry = [
  {
    bot: repliqBot,
    commands: [
      connectUserCommand,
    ],
    handlers: []
  },
  {
    bot: loggerBot,
    commands: [
      weatherCommand,
      broadcastCommand,
      checkOnlineCommand,
      alertCommand,
      statsCommand,
      giveItemCommand,
      keyboardCommand
    ],
    handlers: [
      messageHandler
    ]
  }
];

async function startBots() {
  await loggerBot.start()
  await repliqBot.start()

  for (const entry of commandRegistry) {
    for (const registerCommand of entry.commands) {
      registerCommand(entry.bot);
    }

    for (const registerHandler of entry.handlers) {
      registerHandler(entry.bot);
    }

    logger.success(`[${entry.bot.info?.first_name ?? "Unknown Bot"}] Registered ${entry.commands.length} commands, ${entry.handlers.length} handlers`);
  }
}

async function startNats() {
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

  subscribeDisconnectService()
  natsLogger.success("Subscribed to disconnect service")
}

await startBots()
await startNats()

logger.success("Logger Backend started")