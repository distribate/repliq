import { Bot, TelegramBotCommand } from 'gramio';

export const fasberryBot = new Bot(process.env.FASBERRY_BOT_TOKEN as string)
.onStart(async () => {
  console.log('\x1B[35mFasberry bot started\x1B[0m')
})

const botCommands: TelegramBotCommand[] = [
  {
    command: "/keyboard",
    description: "Открыть клавиатуру"
  },
  { 
    command: "/broadcast",
    description: "Отправить объявление"
  },
  { 
    command: "/weather",
    description: "Установить погоду"
  },
]

export const loggerBot = new Bot(process.env.LOGGER_BOT_TOKEN as string)
.onStart(async () => {
  console.log('\x1B[35mLogger bot started\x1B[0m')

  await Promise.all([
    loggerBot.api.setMyName({
      name: 'Sir / Helper',
    }),
    loggerBot.api.setMyCommands({
     commands: botCommands,
    })
  ])
})
