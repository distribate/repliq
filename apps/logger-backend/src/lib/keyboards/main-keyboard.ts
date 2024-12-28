import { loggerBot } from "../../shared/bot.ts"
import { stateToKeyboard } from "../../shared/keyboards.ts"

loggerBot.command("keyboard", async (ctx) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["main"]
  });
})
