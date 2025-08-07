import { type GetFriendsResponse } from '@repo/types/schemas/friend/friend-types';
import { getUserFriendsSchema } from '@repo/types/schemas/user/get-user-friends-schema.ts';
import { forumDB } from "#shared/database/forum-db.ts"
import { sql } from "kysely"
import * as z from "zod"
import { executeWithCursorPagination } from 'kysely-paginate';

type GetUserFriends = z.infer<typeof getUserFriendsSchema> & {
  nickname: string
}

export async function getUserFriendsCount(nickname: string) {
  const query = await forumDB
    .selectFrom("users_friends")
    .select(forumDB.fn.countAll().as('count'))
    .where((eb) =>
      eb.or([
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

// function sortFriendsByDonate<T extends { donate: DonateVariants }>(rows: T[]) {
//   const weights: Record<DonateVariants, number> = {
//     'default': 1,
//     'authentic': 2,
//     'loyal': 3,
//     'arkhont': 4,
//     'dev': 5,
//     'moder': 5,
//     "helper": 5
//   };

//   return rows.sort((a, b) => {
//     return weights[b.donate] - weights[a.donate];
//   });
// }

// export const SORT_TYPES: Record<string, "created_at"> = {
//   "users_friends.created_at": "created_at"
// }

export const DEFAULT_LIMIT_PER_PAGE = 6

// const donateWeightCase = sql`
//   CASE
//     WHEN users.donate = 'default' THEN 1
//     WHEN users.donate = 'authentic' THEN 2
//     WHEN users.donate = 'loyal' THEN 3
//     WHEN users.donate = 'arkhont' THEN 4
//     WHEN users.donate = 'dev' THEN 5
//     WHEN users.donate = 'moder' THEN 5
//     ELSE 0
//   END
// `

// const sortField = SORT_TYPES[sortType]

export const getUserFriends = async ({
  nickname, ascending, sort_type, cursor, limit
}: GetUserFriends): Promise<GetFriendsResponse> => {
  const orderBy = ascending ? "asc" : "desc";

  const query = forumDB
    .selectFrom("users_friends")
    .where((qb) =>
      qb.or([
        qb("user_1", "=", nickname),
        qb("user_2", "=", nickname)
      ])
    )
    .innerJoin(
      "users",
      (join) =>
        join
          .onRef(
            "users.nickname",
            "=",
            sql`CASE WHEN users_friends.user_1 = ${nickname} THEN users_friends.user_2 ELSE users_friends.user_1 END`
          )
          .on("users.nickname", "!=", nickname)
    )
    .leftJoin("users_subs", "users.nickname", "users_subs.nickname")
    .leftJoin("friends_pinned", (join) =>
      join.on(
        sql`friends_pinned.recipient = users.nickname AND friends_pinned.initiator = ${nickname}`
      )
    )
    .leftJoin("friends_notes", (join) =>
      join.on(
        sql`friends_notes.recipient = users.nickname AND friends_notes.initiator = ${nickname}`
      )
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

  const result = await executeWithCursorPagination(query, {
    perPage: limit ?? DEFAULT_LIMIT_PER_PAGE,
    after: cursor,
    fields: [
      { key: "created_at", expression: "users_friends.created_at", direction: orderBy }
    ],
    parseCursor: (cursor) => ({ created_at: new Date(cursor.created_at) }),
  });

  const { endCursor, hasNextPage, hasPrevPage, startCursor, rows } = result

  return {
    data: rows,
    meta: {
      hasNextPage: hasNextPage ?? false,
      hasPrevPage: hasPrevPage ?? false,
      endCursor,
      startCursor
    }
  }
}