import { friendsCountAction } from "#components/friends/models/friends-count.model";
import { incomingRequestsAction, outgoingRequestsAction } from "#components/friends/models/friends-requests.model";
import { myFriendsAction, myFriendsDataAtom } from "#components/friends/models/friends.model";
import { recommendedFriendsAction } from "#components/friends/models/recommended-friends.model";
import { log } from "#shared/utils/log";
import { action, atom, Ctx } from "@reatom/core";
import { sleep, withInit, withReset } from "@reatom/framework";

type FriendsList = "all" | "incoming" | "outgoing" | "search";

export const SEARCH_VALUE_LENGTH = [1, 32]

export const friendsListTypeAtom = atom<FriendsList>("all", "friendsListType").pipe(
  withInit((ctx) => {
    myFriendsAction(ctx)
    return "all"
  }),
  withReset()
)

export const friendsSearchQueryAtom = atom<string>("", "friendsSearchQuery")

const searchIsInitAtom = atom(false, "searchIsInit")
const beforeSearchFriendsAtom = atom([], "beforeSearchFriends")

const FRIENDS_LIST_EVENTS: Record<FriendsList, (ctx: Ctx) => void> = {
  all: (ctx) => myFriendsAction(ctx),
  outgoing: (ctx) => outgoingRequestsAction(ctx),
  incoming: (ctx) => incomingRequestsAction(ctx),
  search: (ctx) => recommendedFriendsAction(ctx)
}

export function resetFriendsOpts(ctx: Ctx) {
  friendsListTypeAtom.reset(ctx)
  friendsCountAction.dataAtom.reset(ctx)
}

friendsListTypeAtom.onChange((ctx, state) => {
  const event = FRIENDS_LIST_EVENTS[state]
  event(ctx)
})

const setTargetDataAction = action((ctx, target: string) => {
  myFriendsDataAtom(ctx, (state) => {
    if (!state) state = []

    const newData = state.filter(exist => exist.nickname.includes(target))

    return newData
  })
}, "setTargetDataAction")

friendsSearchQueryAtom.onChange(async (ctx, target) => {
  await ctx.schedule(() => sleep(200))

  if (!target.length) {
    myFriendsDataAtom(ctx, ctx.get(beforeSearchFriendsAtom))
  }

  if (!ctx.get(searchIsInitAtom)) {
    searchIsInitAtom(ctx, true)
    beforeSearchFriendsAtom(ctx, ctx.get(myFriendsDataAtom) as [])
  }

  if (target.length < SEARCH_VALUE_LENGTH[0] && target.length <= SEARCH_VALUE_LENGTH[1]) {
    return;
  }

  setTargetDataAction(ctx, target)
})

searchIsInitAtom.onChange((_, v) => log("searchIsInitAtom", v))
beforeSearchFriendsAtom.onChange((_, v) => log("beforeSearchFriendsAtom", v))