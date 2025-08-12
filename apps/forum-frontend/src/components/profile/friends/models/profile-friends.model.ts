import { FriendsQuery, getFriends } from "#components/friends/models/friends.model"
import { isParamChanged, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model"
import { atom, batch, Ctx } from "@reatom/core"
import { reatomAsync, take, withReset, withStatusesAtom } from "@reatom/framework"
import { logger } from "@repo/lib/utils/logger"
import { GetFriendsResponse } from "@repo/types/schemas/friend/friend-types"
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema"
import * as z from "zod"

export type GetFriends = { nickname: string } & z.infer<typeof getUserFriendsSchema>

export const friendsDataAtom = atom<GetFriendsResponse["data"] | null>(null, "friendsData").pipe(withReset())
export const friendsMetaAtom = atom<GetFriendsResponse["meta"] | null>(null, "friendsMeta").pipe(withReset())

function resetFriends(ctx: Ctx) {
  friendsDataAtom.reset(ctx)
  friendsMetaAtom.reset(ctx)
}

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  resetFriends(ctx)
  logger.info("friends reset for", state)
}))

export const friendsAction = reatomAsync(async (ctx, options?: FriendsQuery) => {
  if (ctx.get(friendsDataAtom)) {
    return {
      data: ctx.get(friendsDataAtom),
      meta: ctx.get(friendsMetaAtom)
    }
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

    batch(ctx, () => {
      friendsDataAtom(ctx, res.data)
      friendsMetaAtom(ctx, res.meta)
    })
  }
}).pipe(withStatusesAtom())