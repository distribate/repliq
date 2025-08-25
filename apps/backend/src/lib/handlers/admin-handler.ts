import type { Context } from "./message-handler.ts"
import { tempAdmins, userStates } from "../../shared/bots/maps.ts"
import { forumDB } from "../../shared/database/forum-db.ts";

const addNewAdmin = async (userId: string) => {
  return forumDB
    .insertInto("admins")
    // @ts-expect-error
    .values({ user_id: userId })
    .execute();
}

const deleteAdmin = async (userId: string) => {
  return forumDB
    .deleteFrom("admins")
    .where("user_id", "=", userId)
    .execute();
}

const getUserId = async (nickname: string) => {
  return forumDB
    .selectFrom("users")
    .select(["id", "nickname"])
    .where("nickname", "=", nickname)
    .executeTakeFirst();
}

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
