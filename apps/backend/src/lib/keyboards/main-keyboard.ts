import { servicedBot } from "../../shared/bots/index.ts"
import { stateToKeyboard } from "../../shared/bots/keyboards.ts"

servicedBot.command("keyboard", async (ctx) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["main"]
  });
})
