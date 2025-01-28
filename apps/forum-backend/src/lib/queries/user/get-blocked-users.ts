import { forumDB } from '#shared/database/forum-db.ts'
import { executeWithCursorPagination } from 'kysely-paginate';

type GetBlockedUsers = {
  nickname: string,
  cursor?: string
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
    "users.donate",
    "users_blocked.created_at"
  ])
  .where("users_blocked.initiator", "=", nickname)
  .orderBy("users_blocked.created_at", "desc")
  .limit(16)
  
  const res = await executeWithCursorPagination(query, {
    perPage: 16,
    after: cursor,
    fields: [
      {
        key: "created_at",
        direction: "desc",
        expression: "users_blocked.created_at",
      }
    ],
    parseCursor: (cursor) => {
      return {
        created_at: new Date(cursor.created_at),
      }
    },
  })

  return {
    data: res.rows,
    meta: {
      hasNextPage: res.hasNextPage ?? false,
      hasPrevPage: res.hasPrevPage ?? false,
      endCursor: res.endCursor,
      startCursor: res.startCursor
    }
  }
}