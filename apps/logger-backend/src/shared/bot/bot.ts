import { Bot } from 'gramio';
import { botCommands, fasberryBotCommands } from './bot-commands';

export const fasberryBot = new Bot(process.env.FASBERRY_BOT_TOKEN as string)
  .onStart(async () => {
    console.log('\x1B[35m[Telegram bot]\x1B[0m Fasberry bot started')

    fasberryBot.api.setMyCommands({
      commands: fasberryBotCommands,
    })
  })

export const loggerBot = new Bot(process.env.LOGGER_BOT_TOKEN as string)
  .onStart(async () => {
    console.log('\x1B[35m[Telegram bot]\x1B[0m Logger bot started')

    loggerBot.api.setMyCommands({
      commands: botCommands,
    })
  })