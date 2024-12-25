import { loggerBot } from "#shared/bot";
import { stateToKeyboard } from "#shared/keyboards";

loggerBot.command("keyboard", async (ctx) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["main"]
  });
})
