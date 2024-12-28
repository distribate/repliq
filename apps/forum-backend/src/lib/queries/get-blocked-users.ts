import { forumDB } from '../../shared/db.ts';
import type { Expression, SqlBool } from 'kysely';

type GetBlockedUsers = {
  nickname: string,
  cursor: number | null
}

export const getBlockedUsers = async ({
  nickname, cursor
}: GetBlockedUsers) => {
  let query = forumDB
  .selectFrom("users_blocked")
  .leftJoin('users', 'users_blocked.recipient', 'users.nickname')
  .select([
    "users.id",
    "users.nickname",
    "users.name_color",
    "users.real_name",
    "users.donate",
    "users_blocked.created_at"
  ])
  .where((eb) => {
    const filters: Expression<SqlBool>[] = []
    
    if (cursor !== null) {
      // @ts-expect-error
      filters.push(eb("users_blocked.id", ">", cursor))
    }
    
    filters.push(eb("users_blocked.initiator", "=", nickname))
    
    return eb.and(filters)
  })
  .orderBy("users_blocked.created_at", "desc")
  .limit(16)
  
  return await query.execute()
}