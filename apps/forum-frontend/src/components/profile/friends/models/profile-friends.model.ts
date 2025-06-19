import { FriendsQuery, getFriends } from "#components/friends/models/friends.model"
import { isParamChanged, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model"
import { atom, Ctx } from "@reatom/core"
import { reatomAsync, take, withReset, withStatusesAtom } from "@reatom/framework"
import { UserEntity } from "@repo/types/entities/entities-type"
import { Friend, GetFriendsResponse } from "@repo/types/schemas/friend/friend-types"
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema"
import { z } from "zod/v4"

export type GetFriends = Pick<UserEntity, "nickname"> & z.infer<typeof getUserFriendsSchema>

export const friendsDataAtom = atom<GetFriendsResponse["data"] | null>(null, "friendsData").pipe(withReset())
export const friendsMetaAtom = atom<GetFriendsResponse["meta"] | null>(null, "friendsMeta").pipe(withReset())
export const friendsPinnedDataAtom = atom<Friend[]>([], "friendsPinnedData").pipe(withReset())
export const friendsNotPinnedDataAtom = atom<Friend[]>([], "friendsNotPinnedData").pipe(withReset())

function resetFriends(ctx: Ctx) {
  friendsDataAtom.reset(ctx)
  friendsMetaAtom.reset(ctx)
  friendsPinnedDataAtom.reset(ctx)
  friendsNotPinnedDataAtom.reset(ctx)
}

export const friendsAction = reatomAsync(async (ctx, options?: FriendsQuery) => {
  if (ctx.get(friendsDataAtom)) {
    const cache = { data: ctx.get(friendsDataAtom), meta: ctx.get(friendsMetaAtom) }
    return cache
  }

  let nickname = ctx.get(requestedUserParamAtom)

  if (!nickname) {
    nickname = await take(ctx, requestedUserParamAtom)
  }

  if (!nickname) return;

  return await ctx.schedule(() => getFriends({
    nickname,
    limit: options?.limit,
    sort_type: options?.sort_type ?? "created_at",
    ascending: options?.ascending ?? true
  }))
}, {
  name: "friendsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    // friendsFilteringAtom(ctx, (state) => ({ ...state, cursor: res.meta?.endCursor }))
    friendsDataAtom(ctx, res.data)
    friendsMetaAtom(ctx, res.meta)
  }
}).pipe(withStatusesAtom())

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => resetFriends(ctx)))