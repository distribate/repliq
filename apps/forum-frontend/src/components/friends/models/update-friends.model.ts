import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, batch } from "@reatom/core";
import { getFriends, myFriendsDataAtom, myFriendsMetaAtom } from "./friends.model";
import { friendsUpdateOptionsAtom } from "../components/filtering/models/friends-filtering.model";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { Friend } from "@repo/types/schemas/friend/friend-types";

type UpdateFriends = "update-filter" | "update-cursor"

const updateFriendsActionVariablesAtom = atom<UpdateFriends>("update-filter", "updateFriendsActionVariables")

export const updateFriendsAction = reatomAsync(async (ctx, type: UpdateFriends) => {
  const hasMore = ctx.get(myFriendsMetaAtom)?.hasNextPage
  if (!hasMore) return

  const nickname = ctx.get(currentUserNicknameAtom)
  if (!nickname) return;

  const filtering = ctx.get(friendsUpdateOptionsAtom)
  if (!filtering) return;

  updateFriendsActionVariablesAtom(ctx, type)

  const { cursor, sort_type, ascending, limit } = filtering;

  return await getFriends({ nickname, ascending, sort_type, cursor, limit })
}, {
  name: "updateFriendsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return

    const variables = ctx.get(updateFriendsActionVariablesAtom)
    if (!variables) return;

    if (variables === "update-filter") {
      batch(ctx, () => {
        myFriendsDataAtom(ctx, res.data as Friend[])
        myFriendsMetaAtom(ctx, res.meta)
        friendsUpdateOptionsAtom(ctx, (state) => ({ ...state, cursor: undefined }))
      })

      return
    }

    if (variables === 'update-cursor') {
      batch(ctx, () => {
        myFriendsDataAtom(ctx, (state) => {
          if (!state) state = []

          return [...state, ...res.data as Friend[]]
        })

        myFriendsMetaAtom(ctx, res.meta)

        friendsUpdateOptionsAtom(ctx, (state) => ({ ...state, cursor: res.meta.endCursor }))
      })
    }
  }
}).pipe(withStatusesAtom())