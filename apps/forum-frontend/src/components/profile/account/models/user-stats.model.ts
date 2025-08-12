import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { ProfileStatsDetailed } from "@repo/types/routes-types/get-user-profile-stats-types";
import { forumUserClient } from "#shared/forum-client"

export const userProfileStatsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["get-user-profile-stats"].$get();
    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.data as ProfileStatsDetailed;
  })
}, {
  name: "userProfileStatsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withDataAtom(), withCache())