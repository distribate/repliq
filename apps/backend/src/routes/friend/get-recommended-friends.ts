import { throwError } from '#utils/throw-error.ts';
import { getNickname } from "#lib/modules/context.ts";
import { Hono } from "hono";
import { forumDB } from '#shared/database/forum-db.ts';
import { sql } from 'kysely';
import { getUserFriendsCount } from '#routes/user/get-user-friends.ts';
import { logger } from '@repo/shared/utils/logger.ts';

type Friend = {
  nickname: string,
  name_color: string,
  avatar: string | null
}

type Fof = Friend & {
  details: {
    fromFriend: Friend
  } | null
}

async function getFriends(
  nickname: string,
  { limit }: { limit?: number } = {}
): Promise<Friend[]> {
  let query = forumDB
    .selectFrom("users_friends")
    .innerJoin("users as user1", "user1.nickname", "users_friends.user_1")
    .innerJoin("users as user2", "user2.nickname", "users_friends.user_2")
    .select([
      "users_friends.user_1",
      "user1.name_color as user_1_color",
      "user1.avatar as user_1_avatar",
      "users_friends.user_2",
      "user2.name_color as user_2_color",
      "user2.avatar as user_2_avatar",
    ])
    .where((qb) =>
      qb.or([
        qb("user_1", "=", nickname),
        qb("user_2", "=", nickname)
      ])
    )

  if (limit) {
    query = query.limit(limit)
  }

  const rows = await query.orderBy(sql`random()`).execute()

  const friendsMap = new Map<string, { name_color: string, avatar: string | null }>()

  for (const { user_1, user_1_color, user_2_avatar, user_1_avatar, user_2, user_2_color } of rows) {
    if (user_1 !== nickname) {
      friendsMap.set(user_1, { name_color: user_1_color, avatar: user_1_avatar })
    }
    if (user_2 !== nickname) {
      friendsMap.set(user_2, { name_color: user_2_color, avatar: user_2_avatar })
    }
  }

  return Array.from(friendsMap, ([nickname, name_color]) => ({ nickname, ...name_color }))
}

async function getSimilarUsersByFriends(nickname: string) {
  const fullFoi = await getFriends(nickname);

  if (!fullFoi || !fullFoi.length) return [];

  const fullFoiSet = new Set(fullFoi.map(target => target.nickname));
  fullFoiSet.add(nickname);

  const friendsNicknames = fullFoi.map(target => target.nickname);

  const rows = await forumDB
    .selectFrom("users_friends")
    .innerJoin("users as user1", "user1.nickname", "users_friends.user_1")
    .innerJoin("users as user2", "user2.nickname", "users_friends.user_2")
    .select([
      "users_friends.user_1",
      "user1.name_color as user_1_color",
      "user1.avatar as user_1_avatar",
      "users_friends.user_2",
      "user2.name_color as user_2_color",
      "user2.avatar as user_2_avatar"
    ])
    .where((qb) =>
      qb.or([
        qb("users_friends.user_1", "in", friendsNicknames),
        qb("users_friends.user_2", "in", friendsNicknames)
      ])
    )
    .orderBy(sql`random()`)
    .limit(500)
    .execute();

  const fofMap = new Map<string, Fof>();

  for (const { user_1, user_1_color, user_2_avatar, user_1_avatar, user_2, user_2_color } of rows) {
    if (!fullFoiSet.has(user_1)) {
      const fromFriend = fullFoi.find(f => f.nickname === user_2);

      if (fromFriend && !fofMap.has(user_1)) {
        fofMap.set(user_1, { nickname: user_1, name_color: user_1_color, avatar: user_1_avatar, details: { fromFriend } });
      }
    }
    if (!fullFoiSet.has(user_2)) {
      const fromFriend = fullFoi.find(f => f.nickname === user_1);

      if (fromFriend && !fofMap.has(user_2)) {
        fofMap.set(user_2, { nickname: user_2, name_color: user_2_color, avatar: user_2_avatar, details: { fromFriend } });
      }
    }

    if (fofMap.size >= 15) break;
  }

  const result: Fof[] = Array.from(fofMap.values());

  return result
}

async function getRandomUsers(nickname: string): Promise<Fof[]> {
  const randomUsers = await forumDB
    .selectFrom("users")
    .select([
      "nickname", "name_color", "avatar"
    ])
    .where("nickname", "!=", nickname)
    .orderBy(sql`random()`)
    .limit(15)
    .execute()

  return randomUsers.map(target => ({ ...target, details: null }))
}

const LIMIT_FRIENDS_FOR_FOFF = 2

export const getRecommendedFriendsRoute = new Hono()
  .get("/recommended-friends", async (ctx) => {
    const nickname = getNickname()

    try {
      const currentFriendsCount = await getUserFriendsCount(nickname)

      let type: "random" | "foff" = "random";
      let data: Fof[] | null = null

      if (currentFriendsCount >= LIMIT_FRIENDS_FOR_FOFF) {
        type = "foff"
      }

      try {
        if (type === 'foff') {
          data = await getSimilarUsersByFriends(nickname);
        } else {
          data = await getRandomUsers(nickname)
        }
      } catch (e) {
        data = await getRandomUsers(nickname)
      }

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })