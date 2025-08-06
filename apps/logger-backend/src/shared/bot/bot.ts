import { Bot } from 'gramio';
import { loggerBotCmds, repliqBotCmds } from './bot-commands';

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