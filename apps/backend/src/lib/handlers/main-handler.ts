import type { Context } from "./message-handler.ts"
import type { Selectable } from 'kysely';
import type { Admins } from "@repo/types/db/forum-database-types"
import { forumDB } from "#shared/database/forum-db.ts";

type AdminList = Omit<Selectable<Admins>, "created_at" | "id"> & {
  nickname: string
}

const adminsListMessage = (admins: Array<AdminList>) => {
  return `
      Список админов: \n\n${admins
      .map(admin => `Nickname: ${admin.nickname} \nTelegram ID: ${admin.telegram_id} \nForum ID: ${admin.user_id}`)
      .join('\n\n')}
    `
}

export const sendAdminsList = async (ctx: Context) => {
  const admins = await forumDB
    .selectFrom("admins")
    .innerJoin("users", "admins.user_id", "users.id")
    .select([
      "admins.user_id",
      "admins.telegram_id",
      "users.nickname"
    ])
    .execute()

  return ctx.send(adminsListMessage(admins));
};