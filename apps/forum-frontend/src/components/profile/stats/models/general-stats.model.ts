import { playerClient } from "@repo/shared/api/minecraft-client";
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";

async function getUserStats(nickname: string) {
  const res = await playerClient.player["get-player-stats"][":nickname"].$get({ param: { nickname } })
  const data = await res.json()

  if (!data || "error" in data) return null

  return data.data
}

export const generalStatsResource = reatomResource(async (ctx) => {
  const target = ctx.spy(requestedUserParamAtom)
  if (!target) return;

  return await ctx.schedule(() => getUserStats(target))
}, "generalStatsResource").pipe(withDataAtom(), withCache(), withStatusesAtom())