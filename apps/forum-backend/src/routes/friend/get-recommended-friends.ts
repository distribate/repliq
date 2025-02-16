import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { getNatsConnection } from '@repo/config-nats/nats-client';
import type { UserLands } from '#routes/user/get-my-lands.ts';

async function getSimilarUsersByLand(nickname: string) {
  try {
    const nc = getNatsConnection()

    const req = await nc.request("get-user-lands", nickname)

    const lands: UserLands = JSON.parse(
      new TextDecoder().decode(req.data)
    )

    const uniqueUsers = new Set<{ land: { ulid: string; name: string }; members: { uuid: string; nickname: string } }>();

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

    console.log(uniqueUsers);

    return Array.from(uniqueUsers);
  } catch (e) {
    console.error(e)
  }
}

export const getRecommendedFriendsRoute = new Hono()
  .get("/get-recommended-friends", async (ctx) => {
    const nickname = getNickname()

    try {
      const usersByLands = await getSimilarUsersByLand(nickname)

      return ctx.json({ data: usersByLands }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })