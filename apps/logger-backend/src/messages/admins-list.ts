import { Selectable } from 'kysely';
import { Admins, DB } from "@repo/types/db/forum-database-types"

type AdminList = Omit<Selectable<Admins>, "created_at" | "id"> & {
  nickname: string
}

export const adminsListMessage = (admins: Array<AdminList>) => {
  return `
      Список админов: \n\n${admins
        .map(admin => `Nickname: ${admin.nickname} \nTelegram ID: ${admin.telegram_id} \nForum ID: ${admin.user_id}`)
        .join('\n\n')}
    `
}