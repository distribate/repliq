import { getUserFriendsSchema } from '@repo/types/schemas/user/get-user-friends-schema.ts';
import { forumDB } from "#shared/database/forum-db.ts"
import { sql } from "kysely"
import * as z from "zod"
import { executeWithCursorPagination } from 'kysely-paginate';

type GetUserFriends = z.infer<typeof getUserFriendsSchema>

export async function getUserFriendsCount(nickname: string): Promise<number> {
  const query = await forumDB
    .selectFrom("users_friends")
    .select(forumDB.fn.countAll().as('count'))
    .where((eb) => eb
      .or([
        eb('user_1', '=', nickname),
        eb('user_2', '=', nickname),
      ]),
    )
    .$narrowType<{ count: number }>()
    .executeTakeFirst();

  if (!query) {
    return 0
  }

  return query.count
}

export const DEFAULT_LIMIT_PER_PAGE = 6

export async function getUserFriends(
  nickname: string,
  { ascending, sort_type, cursor, limit, searchQuery }: GetUserFriends
) {
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
    .select(eb => [
      "users.nickname",
      "users.real_name",
      "users.avatar",
      "users.name_color",
      "users_friends.created_at",
      "users.description",
      eb.case()
        .when('users_subs.id', 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('is_donate'),
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
    perPage: limit ?? DEFAULT_LIMIT_PER_PAGE,
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
