import { userClient } from "#shared/forum-client";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";

async function getRecommendedFriends(init?: RequestInit) {
  const res = await userClient.user["get-recommended-friends"].$get({}, { init });
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)
 
  return data.data
}

export const recommendedFriendsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getRecommendedFriends({ signal: ctx.controller.signal }))
}, {
  name: "recommendedFriendsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())