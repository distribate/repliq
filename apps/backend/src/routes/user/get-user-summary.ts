import { throwError } from '#utils/throw-error.ts';
import { getNickname } from "#lib/modules/context.ts";
import { Hono } from "hono";
import { getUserRelation } from "#lib/queries/user/get-user-relation.ts";
import { getUserFriendsCount } from "#lib/queries/user/get-user-friends.ts";
import { getUserThreadsCount } from "#lib/queries/user/get-user-threads.ts";
import type { UserDetailed } from "@repo/types/entities/user-type";
import { getUser } from '#lib/queries/user/get-user.ts';
import { getFriendship } from '#lib/queries/friend/get-friendship.ts';

type UserSummaryStatus = "blocked" | "private" | "default" | "banned"

type UserSummaryDetails = Pick<UserDetailed,
  | "created_at"
  | "real_name"
  | "preferences"
  | "description"
> & {
  threads_count: number,
  friends_count: number,
  shared_friends: string[]
}

type UserSummaryData = Pick<UserDetailed,
  | "nickname"
  | "name_color"
  | "avatar"
  | "account_status"
  | "is_donate"
>

type UserSummary = UserSummaryData & {
  details: UserSummaryDetails | null
}

type EndData = { 
  data: UserSummary,
  status: UserSummaryStatus 
}

export const getUserSummaryRoute = new Hono()
  .get("/user-summary/:nickname", async (ctx) => {
    const recipient = ctx.req.param("nickname");
    const initiator = getNickname()

    try {
      const user = await getUser({ initiator, recipient, type: "detailed" }) as UserDetailed

      if (!user) {
        return ctx.json({ error: "User not found" }, 404)
      }

      const userData: UserSummaryData = {
        nickname: user.nickname,
        name_color: user.name_color,
        avatar: user.avatar,
        account_status: user.account_status,
        is_donate: user.is_donate,
      }

      const [userStatus, friendShip] = await Promise.all([
        getUserRelation({ initiator, recipient }),
        getFriendship({ initiator, recipient })
      ])

      if (!friendShip) {
        const isBlocked = userStatus === 'blocked-by-user' || userStatus === 'blocked-by-you';
        const isPrivated = userStatus === 'private';
        
        if (isBlocked) {
          const data: EndData = {
            data: {
              ...userData,
              details: null
            },
            status: "blocked"
          }

          return ctx.json({ data }, 200);
        }

        if (isPrivated) {
          const data: EndData = {
            data: {
              ...userData,
              details: null
            },
            status: "private", 
          }

          return ctx.json({ data }, 200)
        }
      }

      const [threadsCount, friendsCount] = await Promise.all([
        getUserThreadsCount(recipient),
        getUserFriendsCount(recipient)
      ]);

      const data: EndData = {
        data: {
          ...userData,
          details: {
            description: user.description,
            created_at: user.created_at,
            preferences: user.preferences,
            real_name: user.real_name,
            threads_count: threadsCount,
            friends_count: friendsCount,
            shared_friends: [],
          }
        },
        status: "default"
      }

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })