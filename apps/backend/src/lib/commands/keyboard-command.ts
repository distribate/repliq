import { Bot } from "gramio"
import { stateToKeyboard } from "../../shared/bots/keyboards.ts"
import { validateAdminRequest } from "../../utils/validate-request.ts"

export function keyboardCommand(bot: Bot) {
  bot.command("keyboard", async (ctx) => {
    if (!ctx.from) {
      return
    }

    const userId = ctx.from.id
    const isAdmin = await validateAdminRequest(userId);

    if (!isAdmin) {
      return ctx.reply('У вас нет доступа к этой команде');
    }

    return ctx.reply("Выберите действие", {
      reply_markup: stateToKeyboard["main"]
    });
  })
}
