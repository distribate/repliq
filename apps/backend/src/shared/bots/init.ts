import { Bot } from 'gramio';
import { loggerBotCmds, repliqBotCmds } from './cmds';
import { keyboardCommand } from "../../lib/commands/keyboard-command.ts"
import { alertCommand } from "../../lib/commands/alert-command.ts"
import { connectUserCommand } from "../../lib/commands/connect-command.ts"
import { messageHandler } from "../../lib/handlers/message-handler.ts";
import { logger } from "@repo/shared/utils/logger.ts";

export const repliqBot = new Bot(process.env.REPLIQ_BOT_TOKEN as string)
  .onStart(async () => {
    console.log('\x1B[35m[Telegram bot]\x1B[0m Repliq bot started')

    repliqBot.api.setMyCommands({
      commands: repliqBotCmds,
    })
  })

export const loggerBot = new Bot(process.env.LOGGER_BOT_TOKEN as string)
  .onStart(async () => {
    console.log('\x1B[35m[Telegram bot]\x1B[0m Logger bot started')

    loggerBot.api.setMyCommands({
      commands: loggerBotCmds,
    })
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
    bot: loggerBot,
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