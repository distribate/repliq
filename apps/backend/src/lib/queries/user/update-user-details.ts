import { forumDB } from '#shared/database/forum-db.ts';
import type { Updateable } from 'kysely';
import type { Users } from '@repo/types/db/forum-database-types.ts';

type UserDetails = Pick<Updateable<Users>,
  | "birthday"
  | "real_name"
  | "name_color"
  | "description"
>

type UpdateUserDetails = {
  criteria: keyof Partial<UserDetails>,
  value: string | null | number
}

export const updateUserDetails = async (
  nickname: string,
  { criteria, value }: UpdateUserDetails
) => {
  let query = forumDB.updateTable("users")

  query = query
    .set({ [criteria]: value })
    .where("nickname", "=", nickname)

  return query.returning(criteria).executeTakeFirstOrThrow()
}