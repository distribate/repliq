import { adminHandler } from "./admin-handler.ts"
import { Bot, type DeriveDefinitions, type MessageContext } from "gramio"
import { sendAdminsList } from "./main-handler.ts"
import { stateToKeyboard } from "../../shared/bots/keyboards.ts"
import { tempAdmins, userStates } from "../../shared/bots/maps.ts"
import { validateRequest } from "../../utils/validate-request.ts"

export const restrictedCommands = [
  "Управление",
  "Список админов",
  "Назад",
  "Добавить администратора",
  "Удалить администратора"
]

export type Context = MessageContext<Bot<{}, DeriveDefinitions>>

const controlHandler = (ctx: Context) => {
  return ctx.reply("Выберите действие", {
    reply_markup: stateToKeyboard["control"]
  });
};

export function messageHandler(bot: Bot) {
  bot.on("message", handler);
}

export const handler = async (ctx: Context, next: () => void) => {
  if (!ctx.text || !ctx.from) return;

  const userId = ctx.from.id
  const isCommand = ctx.text.startsWith("/");
  const commandText = isCommand ? ctx.text.slice(1) : ctx.text;

  if (isCommand && restrictedCommands.includes(commandText)) {
    const isAdmin = await validateRequest(userId);

    if (!isAdmin) {
      return ctx.reply('У вас нет доступа к этой команде');
    }

    next();
  }

  if (commandText === "Назад") {
    userStates.delete(userId.toString());
    tempAdmins.delete(userId.toString());

    return ctx.reply("Выберите действие", {
      reply_markup: stateToKeyboard["main"]
    });
  }

  if (commandText === 'Управление') {
    return controlHandler(ctx)
  }

  if (commandText === "Список админов") {
    return sendAdminsList(ctx);
  }

  if (commandText === 'Добавить администратора') {
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