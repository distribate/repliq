import type { Context } from "./message-handler.ts"
import { stateToKeyboard } from "../../shared/bot/keyboards.ts"

export const controlHandler = (ctx: Context) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["control"]
  });
};
