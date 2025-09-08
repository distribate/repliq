import { forumDB } from "#shared/database/forum-db.ts";
import type { GetFriendsResponse } from "@repo/types/schemas/friend/friend-types";
import type { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { sql } from "kysely";
import { executeWithCursorPagination } from "kysely-paginate";
import * as z from "zod";

export const getMyFriends = async (
  nickname: string,
  { ascending, sort_type, cursor, limit, searchQuery }: z.infer<typeof getUserFriendsSchema>
): Promise<GetFriendsResponse> => {
  const direction = ascending ? "asc" : "desc";

  let query = forumDB
    .selectFrom("users_friends")
    .where((qb) => qb
      .or([
        qb("user_1", "=", nickname),
        qb("user_2", "=", nickname)
      ])
    )
    .innerJoin(
      "users", (join) => join
        .onRef("users.nickname", "=", sql`CASE WHEN users_friends.user_1 = ${nickname} THEN users_friends.user_2 ELSE users_friends.user_1 END`)
        .on("users.nickname", "!=", nickname)
    )
    .leftJoin("users_subs", "users.nickname", "users_subs.nickname")
    .leftJoin("friends_pinned", (join) => join
      .on(sql`friends_pinned.recipient = users.nickname AND friends_pinned.initiator = ${nickname}`)
    )
    .leftJoin("friends_notes", (join) => join
      .on(sql`friends_notes.recipient = users.nickname AND friends_notes.initiator = ${nickname}`)
    )
    .select(eb => [
      "users_friends.id as friend_id",
      "users_friends.created_at",
      "users.nickname",
      "users.description",
      "users.real_name",
      "users.avatar",
      "users.name_color",
      eb.case()
        .when('users_subs.id', 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('is_donate'),
      "friends_notes.note",
      sql<boolean>`COALESCE(friends_pinned.id IS NOT NULL, false)`.as("is_pinned"),
    ])

  if (searchQuery && searchQuery.length >= 1) {
    query = query
      .where((qb) => qb
        .or([
          qb("users_friends.user_1", "ilike", `%${searchQuery}%`),
          qb("users_friends.user_2", "ilike", `%${searchQuery}%`)
        ])
      )
  }

  const res = await executeWithCursorPagination(query, {
    perPage: limit ?? 12,
    after: cursor,
    fields: [
      {
        key: "created_at",
        expression: "users_friends.created_at",
        direction
      }
    ],
    parseCursor: (cursor) => ({
      created_at: new Date(cursor.created_at)
    }),
  });

  return {
    data: res.rows,
    meta: {
      hasNextPage: res.hasNextPage ?? false,
      hasPrevPage: res.hasPrevPage ?? false,
      endCursor: res.endCursor,
      startCursor: res.startCursor,
    }
  }
}