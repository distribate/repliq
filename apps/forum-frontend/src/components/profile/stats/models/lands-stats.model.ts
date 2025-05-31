import { playerClient } from "@repo/shared/api/minecraft-client";
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";

async function getUserLands(nickname: string) {
  const res = await playerClient.player['get-player-lands'][':nickname'].$get({
    param: { nickname }, query: { exclude: undefined },
  })

  const data = await res.json()

  if (!data || 'error' in data) return null;

  return data.data;
}

export const landsStatsResource = reatomResource(async (ctx) => {
  const target = ctx.spy(requestedUserParamAtom)
  if (!target) return;

  return await ctx.schedule(() => getUserLands(target))
}, "landsStatsResource").pipe(withDataAtom(), withCache(), withStatusesAtom())