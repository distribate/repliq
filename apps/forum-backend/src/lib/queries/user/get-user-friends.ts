import { type FriendWithDetails, type FriendWithoutDetails } from '@repo/types/schemas/friend/friend-types';
import { getUserFriendsSchema } from '@repo/types/schemas/user/get-user-friends-schema.ts';
import { forumDB } from "#shared/database/forum-db.ts"
import { sql } from "kysely"
import type { z } from "zod"

type GetUserFriends = z.infer<typeof getUserFriendsSchema> & {
  nickname: string
}

export const getUserFriends = async ({
  nickname, with_details, ascending, searchQuery, range, sort_type
}: GetUserFriends): Promise<FriendWithDetails[] | FriendWithoutDetails[]> => {
  let query = forumDB

  const baseQuery = query
  .selectFrom("users_friends")
  .where((qb) => 
    qb.or([
      qb("user_1", "=", nickname),
      qb("user_2", "=", nickname)
    ])
  )

  const donateWeightCase = sql`
    CASE
      WHEN users.donate = 'default' THEN 1
      WHEN users.donate = 'authentic' THEN 2
      WHEN users.donate = 'loyal' THEN 3
      WHEN users.donate = 'arkhont' THEN 4
      WHEN users.donate = 'dev' THEN 5
      WHEN users.donate = 'moder' THEN 5
      ELSE 0
    END
  `

  const sortOrder = ascending ? "asc" : "desc";
  const sortType = sort_type === "donate_weight" ? donateWeightCase : "users_friends.created_at"
    
  if (with_details) {
    const friendsData = await baseQuery
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
    .leftJoin("friends_pinned", "friends_pinned.recipient", "users.nickname")
    .leftJoin("friends_notes", "friends_notes.recipient", "users.nickname")
    // @ts-ignore
    .select([
      "users_friends.id as friend_id",
      "users_friends.created_at",
      "users.nickname",
      "users.description",
      "users.real_name",
      "users.name_color",
      "users.favorite_item",
      "users.donate",
      "friends_notes.note",
      // Update is_pinned to be properly cast as boolean
      sql<boolean>`COALESCE(friends_pinned.id IS NOT NULL, false)`.as("is_pinned"),
      // Ensure donate_weight is properly selected
      donateWeightCase.as("donate_weight")
    ])
    .orderBy(sortType, sortOrder)
    .execute();

    console.log(friendsData)
    return friendsData
  } else {
    const friendsData = await baseQuery
    .innerJoin("users", (join) =>
      join
        .onRef("users.nickname", "=", sql`COALESCE(users_friends.user_1, users_friends.user_2)`)
        .on("users.nickname", "!=", nickname)
    )
    .select(["users.nickname", "users.name_color", "users_friends.id as friend_id"])
    .orderBy(sortType, sortOrder)
    .execute();

    return friendsData
  }
}