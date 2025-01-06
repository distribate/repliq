import { forumDB } from '#shared/database/forum-db.ts';
import type { Updateable } from 'kysely';
import type { Users } from '@repo/types/db/forum-database-types.ts';

export type UserDetails = Pick<Updateable<Users>,
  | "birthday"
  | "real_name"
  | "name_color"
  | "description"
  | "favorite_item"
>

type UpdateUserDetails = {
  criteria: keyof Partial<UserDetails>,
  value: string | null
  nickname: string
}

export const updateUserDetails = async ({
  criteria, nickname, value
}: UpdateUserDetails) => {
  let query = forumDB.updateTable("users")
  
  query = query
  .set({ [criteria]: value })
  .where("nickname", "=", nickname)
  
  return await query
  .returning(criteria)
  .executeTakeFirstOrThrow()
}