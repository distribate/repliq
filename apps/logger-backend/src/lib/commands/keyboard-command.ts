import { Bot } from "gramio"
import { stateToKeyboard } from "../../shared/bot/keyboards.ts"
import { validateRequest } from "../../utils/validate-request.ts"

export function keyboardCommand(bot: Bot) {
  bot.command("keyboard", async (ctx) => {
    if (!ctx.from) {
      return
    }

    const userId = ctx.from.id
    const isAdmin = await validateRequest(userId);

    if (!isAdmin) {
      return ctx.reply('У вас нет доступа к этой команде');
    }

    return ctx.reply("Выберите действие", {
      reply_markup: stateToKeyboard["main"]
    });
  })
}
