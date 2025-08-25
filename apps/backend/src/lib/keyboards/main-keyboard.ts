import { loggerBot } from "../../shared/bots/init.ts"
import { stateToKeyboard } from "../../shared/bots/keyboards.ts"

loggerBot.command("keyboard", async (ctx) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["main"]
  });
})
