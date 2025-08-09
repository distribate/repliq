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
  const query = forumDB
    .selectFrom('friends_requests')
    .innerJoin("users", "users.nickname", type === "incoming" ? "friends_requests.recipient" : "friends_requests.initiator")
    .select([
      "friends_requests.id",
      "friends_requests.created_at",
      "friends_requests.initiator",
      "friends_requests.recipient",
      "users.avatar"
    ])
    .where(type === "incoming" ? "recipient" : "initiator", '=', nickname)

  const res = await executeWithCursorPagination(query, { 
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