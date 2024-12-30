import { Selectable } from 'kysely';
import { forumDB } from "../shared/database/forum-db"
import { Admins } from '@repo/types/db/forum-database-types';

type AdminsWithDetails = Omit<Selectable<Admins>, "created_at" | "id"> & {
  nickname: string
}

type AdminsWithoutDetails = Pick<Admins, "telegram_id">

type GetAdminsResult<T> = T extends number
  ? AdminsWithoutDetails[] 
  : AdminsWithDetails[]; 

export const getAdmins = async<T = undefined>(telegramId?: T): Promise<GetAdminsResult<T>> => {
  let query = forumDB.selectFrom("admins")

  if (telegramId) {
    query = query
      .select("telegram_id")
      .where("telegram_id", "=", telegramId.toString())

    return await query.execute() as GetAdminsResult<T>;
  } else {
    query = query
      .innerJoin("users", "admins.user_id", "users.id")
      .select(["admins.user_id", "admins.telegram_id", "users.nickname"])
    
    return await query.execute() as GetAdminsResult<T>;
  }
}