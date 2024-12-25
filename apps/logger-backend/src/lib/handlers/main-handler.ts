import { forumDB } from '@repo/shared/db/forum-db';
import { adminsListMessage } from '#lib/messages/admins-list';
import { Context } from './message-handler';

export const sendAdminsList = async (ctx: Context) => {
  const admins = await forumDB
    .selectFrom("admins")
    .innerJoin("users", "admins.user_id", "users.id")
    .select(["admins.user_id", "admins.telegram_id", "users.nickname"])
    .execute();

  return ctx.send(adminsListMessage(admins));
};
