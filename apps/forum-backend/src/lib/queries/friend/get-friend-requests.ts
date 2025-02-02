import { forumDB } from "#shared/database/forum-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";

type GetFriendRequests = {
  nickname: string;
  type: "incoming" | "outgoing",
  cursor?: string
}

export const getFriendRequests = async ({
  nickname, type, cursor
}: GetFriendRequests) => {
  const q = forumDB
    .selectFrom('friends_requests')
    .selectAll()
    .where(type === "incoming" ? "recipient" : "initiator", '=', nickname)

  const res = await executeWithCursorPagination(q, { 
    perPage: 16,
    after: cursor,
    fields: [
      {
        key: "created_at",
        direction: "desc",
        expression: "created_at",
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
      startCursor: res.startCursor,
      endCursor: res.endCursor,
    }
  }
}