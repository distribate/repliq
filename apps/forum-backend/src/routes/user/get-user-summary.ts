import { throwError } from "#helpers/throw-error.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { getUser } from "./get-user";
import { getUserRelation } from "#lib/queries/user/get-user-relation.ts";
import { getUserFriendsCount } from "#lib/queries/user/get-user-friends-count.ts";
import { getFavoriteItem } from "#lib/queries/user/get-user-favorite-item.ts";
import { getUserRegistrationDateOnServer } from "#lib/queries/user/get-user-registration-date-on-server.ts";
import { getUserThreadsCount } from "#lib/queries/user/get-user-threads-count.ts";
import { isUserDetailed } from "@repo/lib/helpers/is-user-detailed.ts";
import type { UserDetailed } from "@repo/types/entities/user-type";

type UserSummaryStatus = "blocked" | "private" | "default" | "banned"

type UserSummary = Omit<UserDetailed, "favorite_item"> & {
  favorite_item: {
    id: number,
    image: string | null
  } | null,
  threads_count: number,
  friends_count: number,
  registration_dates: {
    server: string | null,
    forum: string | null
  }
}

export const getUserSummaryRoute = new Hono()
  .get("/get-user-summary/:nickname", async (ctx) => {
    const { nickname: recipient } = ctx.req.param();

    const initiator = getNickname()

    try {
      const userStatus = await getUserRelation({
        initiator, recipient
      })

      switch (userStatus) {
        case "blocked-by-user":
          return ctx.json({ status: "blocked", data: null }, 200);
        case "blocked-by-you":
          return ctx.json({ status: "blocked", data: null }, 200);
        case "private":
          return ctx.json({ status: "private", data: null }, 200)
        case "banned":
          return ctx.json({ status: "banned", data: null }, 200)
      }

      const [userThreadsCount, userFriendsCount, userRegistrationServerDate] = await Promise.all([
        getUserThreadsCount(recipient),
        getUserFriendsCount(recipient),
        getUserRegistrationDateOnServer(recipient),
      ]);

      const userData = await getUser({ initiator, recipient, type: "detailed" })

      let favoriteItem = null;

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
        registration_dates: {
          server: userRegistrationServerDate?.REGDATE ?? null,
          forum: userData.created_at ?? null
        }
      }

      return ctx.json<{
        status: UserSummaryStatus; data: UserSummary
      }>({ status: "default", data: user }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })