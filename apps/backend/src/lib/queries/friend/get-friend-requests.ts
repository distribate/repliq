import { forumDB } from "#shared/database/forum-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";

type Opts = {
  type: "incoming" | "outgoing",
  cursor?: string
}

function getDirection(asc: boolean): "asc" | "desc" {
  return asc ? "asc" : "desc"
}

export const getFriendRequests = async (
  nickname: string,
  { type, cursor }: Opts
) => {
  const direction = getDirection(false);

  const target = type === "incoming" ? "friends_requests.initiator" : "friends_requests.recipient"

  const query = forumDB
    .selectFrom('friends_requests')
    .innerJoin("users", "users.nickname", target)
    .select([
      "friends_requests.id",
      "friends_requests.created_at",
      "friends_requests.initiator",
      "friends_requests.recipient",
      "users.avatar",
      "users.name_color"
    ])
    .where(type === "incoming" ? "recipient" : "initiator", '=', nickname)

  const res = await executeWithCursorPagination(query, {
    perPage: 16,
    after: cursor,
    fields: [
      {
        key: "created_at", expression: "created_at", direction
      }
    ],
    parseCursor: (cursor) => ({
      created_at: new Date(cursor.created_at)
    }),
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