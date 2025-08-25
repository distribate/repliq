import { incomingRequestsAction, outgoingRequestsAction } from "#components/friends/models/friends-requests.model";
import { myFriendsAction, myFriendsDataAtom } from "#components/friends/models/friends.model";
import { recommendedFriendsAction } from "#components/friends/models/recommended-friends.model";
import { action, atom } from "@reatom/core";
import { sleep, withInit } from "@reatom/framework";
import { logger } from "@repo/shared/utils/logger.ts";

type FriendsSortType = "date" | "abc";
type FriendsListType = "all" | "incoming" | "outgoing" | "search";

type FriendsUpdateOptions = {
  cursor: string | undefined,
  limit: number
  ascending: boolean,
  sort_type: "donate_weight" | "created_at",
  type: "first" | "other"
}

export const SEARCH_VALUE_MAX_LENGTH = 32
const SEARCH_VALUE_MIN_LENGTH = 1

const friendsUpdateOptionsInitial: FriendsUpdateOptions = {
  cursor: undefined,
  limit: 12,
  ascending: false,
  sort_type: "created_at",
  type: "first",
}

export const friendsUpdateOptionsAtom = atom<FriendsUpdateOptions>(friendsUpdateOptionsInitial, "friendsUpdateOptions")

export const friendsSortTypeAtom = atom<FriendsSortType>("date", "friendsSortType")
export const friendsListTypeAtom = atom<FriendsListType>("all", "friendsListType").pipe(
  withInit((ctx) => {
    myFriendsAction(ctx)
    return "all";
  })
)

friendsListTypeAtom.onChange((ctx, state) => {
  if (state === 'all') return myFriendsAction(ctx)
  if (state === 'outgoing') return outgoingRequestsAction(ctx)
  if (state === 'incoming') return incomingRequestsAction(ctx)
  if (state === 'search') return recommendedFriendsAction(ctx)
})

export const friendsSearchFilterQueryValueAtom = atom<string>("", "friendsSearchFilterQueryvalue")

const searchIsInitAtom = atom(false, "searchIsInit")
const beforeSearchFriendsAtom = atom([], "beforeSearchFriends")

const setTargetDataAction = action((ctx, target: string) => {
  myFriendsDataAtom(ctx, (state) => {
    if (!state) state = []

    const newData = state.filter(exist => exist.nickname.includes(target))

    return newData
  })
}, "setTargetDataAction")

friendsSearchFilterQueryValueAtom.onChange(async (ctx, target) => {
  await ctx.schedule(() => sleep(200))

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

  setTargetDataAction(ctx, target)
})

searchIsInitAtom.onChange((_, state) => import.meta.env.DEV && logger.info("searchIsInitAtom", state))
beforeSearchFriendsAtom.onChange((_, state) => import.meta.env.DEV && logger.info("beforeSearchFriendsAtom", state))