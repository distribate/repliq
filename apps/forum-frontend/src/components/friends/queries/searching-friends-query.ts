import { forumUserClient } from "@repo/shared/api/forum-client";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { UnwrapPromise } from "@repo/lib/helpers/unwrap-promise-type";

async function getSearchingFriends() {
  const res = await forumUserClient.user["get-recommended-friends"].$get();
  const data = await res.json();

  if (!data || "error" in data) return null;

  return data.data
}

type SearchingFriends = UnwrapPromise<ReturnType<typeof getSearchingFriends>> | null

export const searchingFriendsAtom = atom<SearchingFriends>(null, "searchingFriends")

export const searchingFriendsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getSearchingFriends())
}, {
  name: "searchingFriendsAction",
  onFulfill: (ctx, res) => {
    searchingFriendsAtom(ctx, res)
  }
}).pipe(withStatusesAtom())