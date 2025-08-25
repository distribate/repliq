import { getAdmins } from "../queries/get-admins.ts";
import type { Context } from "./message-handler.ts"
import type { Selectable } from 'kysely';
import type { Admins, DB } from "@repo/types/db/forum-database-types"

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
  const admins = await getAdmins()

  return ctx.send(adminsListMessage(admins));
};