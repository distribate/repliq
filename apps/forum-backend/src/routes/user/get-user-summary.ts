import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { getUserRelation } from "#lib/queries/user/get-user-relation.ts";
import { getUserFriendsCount } from "#lib/queries/user/get-user-friends.ts";
import { getFavoriteItem } from "#lib/queries/user/get-user-favorite-item.ts";
import { getUserThreadsCount } from "#lib/queries/user/get-user-threads.ts";
import { isUserDetailed } from "@repo/lib/helpers/is-user-detailed.ts";
import type { UserDetailed } from "@repo/types/entities/user-type";
import { getUser } from '#lib/queries/user/get-user.ts';
import type { InitiatorRecipientType } from '#types/initiator-recipient-type.ts';
import { forumDB } from '#shared/database/forum-db.ts';
import { getFriendship } from '#lib/queries/friend/get-friendship.ts';

type UserSummaryStatus = "blocked" | "private" | "default" | "banned"

type UserSummary = Omit<UserDetailed, "favorite_item"> & {
  favorite_item: {
    id: number,
    image: string | null
  } | null,
  threads_count: number,
  friends_count: number,
  shared_friends: Array<string> | null
}

// TODO: implement this function
async function getSharedFriends({
  initiator, recipient
}: InitiatorRecipientType): Promise<Array<string> | null> {
  const query = await forumDB
    .selectFrom('users_friends')
    .where((eb) =>
      eb.or([
        eb.and([
          eb('user_1', '=', initiator),
          eb('user_2', '!=', initiator),
          eb('user_2', '!=', recipient),
        ]),
        eb.and([
          eb('user_2', '=', initiator),
          eb('user_1', '!=', initiator),
          eb('user_1', '!=', recipient),
        ])
      ])
    )
    .select(["user_1", "user_2"])
    .limit(8)
    .execute()

  if (!query || !query.length) {
    return null
  }
  
  return null
}

export const getUserSummaryRoute = new Hono()
  .get("/get-user-summary/:nickname", async (ctx) => {
    const { nickname: recipient } = ctx.req.param();

    const initiator = getNickname()

    try {
      const userData = await getUser({ initiator, recipient, type: "detailed" })

      if (!userData) {
        return ctx.json({ error: "User not found" }, 404)
      }

      const [userStatus, friendShip] = await Promise.all([
        getUserRelation({ initiator, recipient }),
        getFriendship({ initiator, recipient })
      ])

      if (!friendShip) {
        switch (userStatus) {
          case "blocked-by-user":
            return ctx.json({ status: "blocked", data: null }, 200);
          case "blocked-by-you":
            return ctx.json({ status: "blocked", data: null }, 200);
          case "private":
            return ctx.json({ status: "private", data: null }, 200)
          // case "banned":
          //   return ctx.json({ status: "banned", data: null }, 200)
        }
      }
      
      const [userThreadsCount, userFriendsCount] = await Promise.all([
        getUserThreadsCount(recipient),
        getUserFriendsCount(recipient)
      ]);

      let favoriteItem: { id: number, image: string | null } | null = null;

      if (!isUserDetailed(userData)) {
        return ctx.json({ status: "default", data: null }, 200)
      }

      if (userData.favorite_item) {
        const favoriteItemQuery = await getFavoriteItem(String(userData.favorite_item))

        favoriteItem = {
          id: Number(favoriteItemQuery?.id),
          image: favoriteItemQuery?.image ?? null
        }
      }

      const user = {
        ...userData,
        favorite_item: favoriteItem,
        threads_count: userThreadsCount,
        friends_count: userFriendsCount,
        shared_friends: null
      }

      return ctx.json<{ data: UserSummary, status: UserSummaryStatus }>({ status: "default", data: user }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })