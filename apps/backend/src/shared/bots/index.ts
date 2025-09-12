import { Bot } from 'gramio';
import { keyboardCommand } from "../../lib/commands/keyboard-command.ts"
import { alertCommand } from "../../lib/commands/alert-command.ts"
import { connectUserCommand } from "../../lib/commands/connect-command.ts"
import { messageHandler } from "../../lib/handlers/message-handler.ts";
import { logger } from "@repo/shared/utils/logger.ts";
import type { TelegramBotCommand } from "gramio";
import { LOGGER_BOT_TOKEN, REPLIQ_BOT_TOKEN } from '#shared/env/index.ts';

const repliqBotCmds: TelegramBotCommand[] = [
  { command: "/connect", description: "Привязать аккаунт" },
]

const servicedBotCmds: TelegramBotCommand[] = [
  { command: "/keyboard", description: "Open the keyboard" },
  { command: "/broadcast", description: "Push a broadcast" },
  { command: "/notify", description: "Alert for all online users on forum" }
]

export const repliqBot = new Bot(REPLIQ_BOT_TOKEN)
  .onStart(async () => {
    console.log('\x1B[35m[Telegram bot]\x1B[0m Repliq bot started')

    repliqBot.api.setMyCommands({ commands: repliqBotCmds })
  })

export const servicedBot = new Bot(LOGGER_BOT_TOKEN as string)
  .onStart(async () => {
    console.log('\x1B[35m[Telegram bot]\x1B[0m Serviced bot started')

    servicedBot.api.setMyCommands({ commands: servicedBotCmds })
  })

export const commandRegistry = [
  {
    bot: repliqBot,
    commands: [
      connectUserCommand,
    ],
    handlers: []
  },
  {
    bot: servicedBot,
    commands: [
      alertCommand,
      keyboardCommand
    ],
    handlers: [
      messageHandler
    ]
  }
];

export async function startBots() {
  await servicedBot.start()
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