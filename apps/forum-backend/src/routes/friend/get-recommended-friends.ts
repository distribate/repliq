import type { UnwrapPromise } from '@repo/lib/helpers/unwrap-promise-type';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { getNatsConnection } from '@repo/config-nats/nats-client';
import { forumDB } from '#shared/database/forum-db.ts';
import { sql } from 'kysely';
import { getUserFriendsCount } from '#routes/user/get-user-friends-count.ts';

type UserLands = {
  nickname: string,
  uuid: string
}

type Fof = {
  nickname: string,
  friend: string
}

type GetFriends = {
  nickname: string,
  limit?: number
}

async function getFriends({
  nickname, limit
}: GetFriends) {
  let query = forumDB
    .selectFrom("users_friends")
    .select(["user_2", "user_1"])
    .where((qb) =>
      qb.or([
        qb("user_1", "=", nickname),
        qb("user_2", "=", nickname)
      ])
    )

  if (limit) {
    query = query.limit(limit)
  }

  const f = await query.orderBy(sql`random()`).execute()

  let friends = new Set<string>()

  for (const { user_1, user_2 } of f) {
    if (user_1 !== nickname) friends.add(user_1)
    if (user_2 !== nickname) friends.add(user_2)
  }

  return Array.from(friends)
}

const BATCH_SIZE = 50;

async function getSimilarUsersByFriends(initiator: string) {
  const fullFoi = await getFriends({ nickname: initiator });

  if (!fullFoi || !fullFoi.length) {
    return [];
  }

  const fullFoiSet = new Set<string>(fullFoi);
  const fofSet = new Set<Fof>()

  const foi: Array<string> = fullFoi
    .sort(() => Math.random() - 0.5)
    .slice(0, 50);

  for (let i = 0; i < foi.length; i += BATCH_SIZE) {
    const batch = foi.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(f => getFriends({ nickname: f, limit: BATCH_SIZE }))
    );

    for (let j = 0; j < batch.length; j++) {
      const friend = batch[j];

      for (const nickname of batchResults[j]) {
        if (!fullFoiSet.has(nickname) && nickname !== initiator) {
          fofSet.add({ nickname, friend });

          if (fofSet.size >= 15) {
            return Array.from(fofSet);
          }
        }
      }
    }
  }

  return Array.from(fofSet)
}

type UniqueUsers = {
  land: {
    ulid: string;
    name: string
  };
  members: UserLands
}

async function getSimilarUsersByLand(nickname: string) {
  const nc = getNatsConnection()

  const req = await nc.request("get-user-lands", nickname)

  const lands = JSON.parse(
    new TextDecoder().decode(req.data)
  )

  const uniqueUsers = new Set<UniqueUsers>();

  for (const land of lands) {
    if (!land.members) continue;

    for (const member of land.members) {
      if (uniqueUsers.size >= 15) break;
      if (member.nickname === nickname) continue;

      uniqueUsers.add({
        land: { ulid: land.ulid, name: land.name },
        members: { uuid: member.uuid, nickname: member.nickname }
      });
    }

    if (uniqueUsers.size >= 15) break;
  }

  return Array.from(uniqueUsers);
}

async function getRandomUsers(nickname: string) {
  const randomUsers = await forumDB
    .selectFrom("users")
    .select(["nickname", "name_color"])
    .where("nickname", "!=", nickname)
    .orderBy(sql`random()`)
    .limit(15)
    .execute()

  return randomUsers
}

type RecommendedFriendsGlobal = {
  byLands: UnwrapPromise<ReturnType<typeof getSimilarUsersByLand>>,
  byFriends: UnwrapPromise<ReturnType<typeof getSimilarUsersByFriends>>
}

type RecommendedFriendsIndividual = Array<{ nickname: string; name_color: string }>

export const getRecommendedFriendsRoute = new Hono()
  .get("/get-recommended-friends", async (ctx) => {
    const nickname = getNickname()

    try {
      const currentFriendsCount = await getUserFriendsCount(nickname)

      let data: RecommendedFriendsIndividual | RecommendedFriendsGlobal | null = null

      if (currentFriendsCount <= 1) {
        const randomUsers = await getRandomUsers(nickname)

        data = randomUsers
      } else {
        try {
          const [usersByLands, friendsOfFriends] = await Promise.all([
            getSimilarUsersByLand(nickname),
            getSimilarUsersByFriends(nickname),
          ])

          data = { byLands: usersByLands, byFriends: friendsOfFriends }
        } catch (e) {
          console.error(e)
          const randomUsers = await getRandomUsers(nickname)

          data = randomUsers
        }
      }

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })