import { forumDB } from '@repo/shared/db/forum-db';
import { Context } from './message-handler';
import { tempAdmins, userStates } from '#shared/maps';

export const adminHandler = async (ctx: Context, userId: string) => {
  if (tempAdmins.has(userId) && ctx.text) {
    const nickname = ctx.text.trim();

    if (!nickname) {
      return ctx.reply("Никнейм не может быть пустым, попробуйте снова.");
    }

    const user = await forumDB
      .selectFrom("users")
      .select(["id", "nickname"])
      .where("nickname", "=", nickname)
      .executeTakeFirst();

    if (!user) {
      return ctx.reply(`Пользователь с никнеймом "${nickname}" не найден.`);
    }

    const action = tempAdmins.get(userId);

    switch (action) {
      case "add":
      await forumDB
        .insertInto("admins")
        .values({ user_id: user.id })
        .execute();

        return ctx.reply(`Пользователь с никнеймом "${nickname}" успешно добавлен в администраторы.`);
      case "remove":
        await forumDB
        .deleteFrom("admins")
        .where("user_id", "=", user.id)
        .execute();

        return ctx.reply(`Пользователь с никнеймом "${nickname}" был удален из администраторов.`);
    }

    tempAdmins.delete(userId);
    userStates.delete(userId);
  }
};
