import type { Context } from "./message-handler.ts"
import { stateToKeyboard } from "../../shared/keyboards.ts"

export const controlHandler = (ctx: Context) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["control"]
  });
};
