import { loggerBot } from "../../shared/bot/bot.ts"
import { stateToKeyboard } from "../../shared/bot/keyboards.ts"

loggerBot.command("keyboard", async (ctx) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["main"]
  });
})
