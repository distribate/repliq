import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { ProfileStatsDetailed } from "@repo/types/routes-types/get-user-profile-stats-types";
import { forumUserClient } from "@repo/shared/api/forum-client"

const getUserProfileStats = async () => {
  const res = await forumUserClient.user["get-user-profile-stats"].$get();
  const data = await res.json();

  if (!data || "error" in data) return null;

  return data.data as ProfileStatsDetailed;
}

export const userProfileStatsResource = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getUserProfileStats())
}, "userProfileStatsResource").pipe(withStatusesAtom(), withDataAtom(), withCache())