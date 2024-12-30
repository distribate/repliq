import type { Context } from "./message-handler.ts"
import { tempAdmins, userStates } from "../../shared/maps/maps.ts"
import { getUserId } from "../../queries/get-user-id.ts";
import { addNewAdmin, deleteAdmin } from "../../queries/update-admins.ts";

export const adminHandler = async (ctx: Context, userId: string) => {
  if (tempAdmins.has(userId) && ctx.text) {
    const nickname = ctx.text.trim();

    if (!nickname) {
      return ctx.reply("Никнейм не может быть пустым, попробуйте снова.");
    }

    const user = await getUserId(nickname)

    if (!user) {
      return ctx.reply(`Пользователь с никнеймом "${nickname}" не найден.`);
    }

    const action = tempAdmins.get(userId);

    switch (action) {
      case "add":
        await addNewAdmin(user.id)

        return ctx.reply(`Пользователь с никнеймом "${nickname}" успешно добавлен в администраторы.`);
      case "remove":
        await deleteAdmin(user.id)

        return ctx.reply(`Пользователь с никнеймом "${nickname}" был удален из администраторов.`);
    }

    tempAdmins.delete(userId);
    userStates.delete(userId);
  }
};
