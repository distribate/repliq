import { forumDB } from '@repo/shared/db/forum-db.ts';
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
  userId: string,
  criteria: keyof Partial<UserDetails>,
  value: string | null
}

export const updateUserDetails = async ({
  criteria, userId, value
}: UpdateUserDetails) => {
  let query = forumDB.updateTable("users")
  
  query = query.set({ [criteria]: value }).where("id", "=", userId)
  
  return await query.returning(criteria).executeTakeFirstOrThrow()
}