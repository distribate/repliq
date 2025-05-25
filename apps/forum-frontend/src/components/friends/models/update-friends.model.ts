import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { getFriends, myFriendsDataAtom, myFriendsMetaAtom } from "./friends.model";
import { friendsUpdateOptionsAtom } from "../components/filtering/models/friends-filtering.model";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types";

const updateFriendsActionVariablesAtom = atom<"update-filter" | "update-cursor">("update-filter", "updateFriendsActionVariables")

export const updateFriendsAction = reatomAsync(async (ctx, type: "update-filter" | "update-cursor") => {
  const hasMore = ctx.get(myFriendsMetaAtom)?.hasNextPage
  if (!hasMore) return

  const nickname = ctx.get(currentUserNicknameAtom)
  if (!nickname) return;

  const filtering = ctx.get(friendsUpdateOptionsAtom)
  if (!filtering) return;

  updateFriendsActionVariablesAtom(ctx, type)

  const { cursor, sort_type, ascending, limit } = filtering;

  return await getFriends({ with_details: true, nickname, ascending, sort_type, cursor, limit })
}, {
  name: "updateFriendsAction",
  onFulfill: (ctx, res) => {
    if (!res) return

    const variables = ctx.get(updateFriendsActionVariablesAtom)
    if (!variables) return;

    if (variables === "update-filter") {
      myFriendsDataAtom(ctx, res.data as FriendWithDetails[])
      myFriendsMetaAtom(ctx, res.meta)
      friendsUpdateOptionsAtom(ctx, (state) => ({ ...state, cursor: undefined }))
      return
    }

    if (variables === 'update-cursor') {
      myFriendsDataAtom(ctx, (state) => [...state, ...res.data as FriendWithDetails[]])
      myFriendsMetaAtom(ctx, res.meta)
      friendsUpdateOptionsAtom(ctx, (state) => ({ ...state, cursor: res.meta.endCursor }))
      return
    }
  }
}).pipe(withStatusesAtom())