import { Bot } from 'gramio';

export const fasberryBot = new Bot(process.env.FASBERRY_BOT_TOKEN as string);
export const loggerBot = new Bot(process.env.LOGGER_BOT_TOKEN as string)