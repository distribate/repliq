import { adminHandler } from './admin-handler';
import { validateRequest } from '#lib/utils/validate-request';
import { Bot, DeriveDefinitions, MessageContext } from 'gramio';
import { controlHandler } from './control-handler';
import { sendAdminsList } from './main-handler';
import { restrictedCommands } from '#shared/restricted-commands';
import { stateToKeyboard } from '#shared/keyboards';
import { tempAdmins, userStates } from '#shared/maps';

export type Context = MessageContext<Bot<{}, DeriveDefinitions>>

export const messageHandler = async (ctx: Context, next: () => void) => {
  if (!ctx.text || !ctx.from) return;

  console.log(`[TEXT]: ${ctx.text}`)

  const userId = ctx.from.id

  if (ctx.text.startsWith("/") || restrictedCommands.includes(ctx.text)) {
    const isAdmin = await validateRequest(userId);

    if (!isAdmin) {
      return ctx.reply('У вас нет доступа к этой команде');
    }

    await next();
  }

  if (ctx.text === "Назад") {
    userStates.delete(userId.toString());
    tempAdmins.delete(userId.toString());
    return ctx.reply("Выберите действие", {
      reply_markup: stateToKeyboard["main"]
    });
  }

  if (ctx.text === 'Управление') {
    return controlHandler(ctx)
  }

  if (ctx.text === "Список админов") {
    return sendAdminsList(ctx);
  }

  if (ctx.text === 'Добавить администратора') {
    tempAdmins.set(userId.toString(), 'add');
    userStates.set(userId.toString(), 'control'); 
    return ctx.reply('Введите никнейм пользователя');
  }

  if (ctx.text === "Удалить администратора") {
    tempAdmins.set(userId.toString(), "remove");
    userStates.set(userId.toString(), 'control'); 
    return ctx.reply("Введите никнейм пользователя")
  }

  return adminHandler(ctx, userId.toString());
};
