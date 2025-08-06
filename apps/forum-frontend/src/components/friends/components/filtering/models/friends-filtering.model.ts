import { myFriendsDataAtom } from "#components/friends/models/friends.model";
import { action, atom } from "@reatom/core";
import { sleep } from "@reatom/framework";
import { logger } from "@repo/lib/utils/logger";

type FriendsViewType = "grid" | "list";
type FriendsSortType = "date" | "abc";
export type FriendsListType = "all"| "incoming"| "outgoing"| "search";

type FriendsView = {
  listType: FriendsListType;
  viewType: FriendsViewType;
  sortType: FriendsSortType;
};

const viewInitial: FriendsView = {
  listType: "all",
  viewType: "list",
  sortType: "date",
};

type FriendsUpdateOptions = {
  cursor: string | undefined,
  limit: number
  ascending: boolean,
  sort_type: "donate_weight" | "created_at",
  type: "first" | "other"
}

const friendsUpdateOptionsInitial: FriendsUpdateOptions = {
  cursor: undefined,
  limit: 12,
  ascending: false,
  sort_type: "created_at",
  type: "first",
}

export const friendsUpdateOptionsAtom = atom<FriendsUpdateOptions>(friendsUpdateOptionsInitial, "friendsUpdateOptions")

friendsUpdateOptionsAtom.onChange((ctx, state) => logger.info("friendsUpdateOptionsAtom", state))

export const SEARCH_VALUE_MAX_LENGTH = 32
const SEARCH_VALUE_MIN_LENGTH = 1

export const friendsViewAtom = atom<FriendsView>(viewInitial, "friendsFiltering")
export const friendsSearchFilterQueryvalueAtom = atom<string>("", "friendsSearchFilterQueryvalue")

const searchIsInitAtom = atom(false, "searchIsInit")
const beforeSearchFriendsAtom = atom([], "beforeSearchFriends")

searchIsInitAtom.onChange((_, state) => logger.info("searchIsInitAtom", state))
beforeSearchFriendsAtom.onChange((_, state) => logger.info("beforeSearchFriendsAtom", state))

const setTargetData = action((ctx, target: string) => {  
  myFriendsDataAtom(ctx, (state) => {
    if (!state || !state.length) return state;
    
    return state.filter(exist => exist.nickname.includes(target))
  })
})

friendsSearchFilterQueryvalueAtom.onChange(async (ctx, target) => {
  await ctx.schedule(() => sleep(500))

  if (!target.length) {
    myFriendsDataAtom(ctx, ctx.get(beforeSearchFriendsAtom))
  }

  if (!ctx.get(searchIsInitAtom)) {
    searchIsInitAtom(ctx, true)
    beforeSearchFriendsAtom(ctx, ctx.get(myFriendsDataAtom) as [])
  }

  if (target.length < SEARCH_VALUE_MIN_LENGTH && target.length <= SEARCH_VALUE_MAX_LENGTH) {
    return;
  }

  setTargetData(ctx, target)
})