import { Context } from './message-handler';
import { stateToKeyboard } from '#shared/keyboards';

export const controlHandler = (ctx: Context) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["control"]
  });
};
