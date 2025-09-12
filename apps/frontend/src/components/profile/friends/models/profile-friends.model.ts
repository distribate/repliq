import { FriendsOpts } from "#components/friends/models/friends.model"
import { isParamChanged, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model"
import { log } from "#shared/utils/log"
import { validateResponse } from "#shared/api/validation"
import { userClient } from "#shared/api/forum-client"
import { createFabric } from "#shared/models/infinity-scroll.model"
import { atom, batch, Ctx } from "@reatom/core"
import { AsyncCtx, reatomAsync, withReset, withStatusesAtom } from "@reatom/framework"

export type ProfileFriendsPayload = Awaited<ReturnType<typeof profileFriendsAction>>;
export type ProfileFriendsPayloadData = NonNullable<ProfileFriendsPayload>["data"]
export type ProfileFriendsPayloadMeta = NonNullable<ProfileFriendsPayload>["meta"]

export const profileFriendsDataAtom = atom<ProfileFriendsPayloadData | null>(null, "profileFriendsData").pipe(withReset())
export const profileFriendsMetaAtom = atom<ProfileFriendsPayloadMeta | null>(null, "friendsMeta").pipe(withReset())

export const profileFriendsSortTypeAtom = atom<"created_at" | "donate_weight">("created_at", "profileFriendsSortType").pipe(withReset())
export const profileFriendsLimitAtom = atom(24, "profileFriendsLimit").pipe(withReset())
export const profileFriendsAscendingAtom = atom(false, "profileFriendsAscending").pipe(withReset())
export const profileFriendsSearchQueryAtom = atom("", "profileFriendsSearchQuery")
export const profileFriendsCursorAtom = atom<string | undefined>(undefined, "profileFriendsCursor")

function resetProfileFriends(ctx: Ctx) {
  batch(ctx, () => {
    profileFriendsDataAtom.reset(ctx)
    profileFriendsMetaAtom.reset(ctx)
  })
}

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  resetProfileFriends(ctx)
  log("profile friends reset", state)
}))

export const profileFriendsAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(requestedUserParamAtom)
  if (!nickname) throw new Error("Nickname is not defined")

  return await ctx.schedule(() => profileFriendsFn(ctx, nickname))
}, {
  name: "profileFriendsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      profileFriendsDataAtom(ctx, res.data)
      profileFriendsMetaAtom(ctx, res.meta)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom())

export async function getUserFriends(
  nickname: string,
  { sort_type, ascending, cursor, limit, searchQuery }: FriendsOpts,
  init?: RequestInit
) {
  const res = await userClient.user["user-friends"][":nickname"].$get({
    param: { nickname },
    query: {
      sort_type,
      ascending: `${ascending}`,
      cursor,
      searchQuery,
      limit: limit ? `${limit}` : undefined
    },
  }, {
    init
  })

  return validateResponse<typeof res>(res);
}

async function profileFriendsFn(ctx: AsyncCtx, nickname: string) {
  const opts = {
    limit: ctx.get(profileFriendsLimitAtom),
    ascending: ctx.get(profileFriendsAscendingAtom),
    sort_type: ctx.get(profileFriendsSortTypeAtom),
    searchQuery: ctx.get(profileFriendsSearchQueryAtom)
  }

  const result = await ctx.schedule(
    () => getUserFriends(nickname, opts, { signal: ctx.controller.signal })
  );

  return result
}

export const profileFriendsFabric = createFabric<ProfileFriendsPayloadData[number], ProfileFriendsPayloadMeta>({
  name: 'profileFriends',
  fn: (ctx) => {
    const nickname = ctx.get(requestedUserParamAtom)
    if (!nickname) throw new Error("Nickname is not defined")
    return profileFriendsFn(ctx, nickname)
  },
  atoms: {
    dataAtom: profileFriendsDataAtom,
    metaAtom: profileFriendsMetaAtom,
    cursorAtom: profileFriendsCursorAtom,
  },
  viewerOpts: {
    threshold: 1
  },
  key: "nickname"
});

export const updateProfileFriendsAction = profileFriendsFabric.update;
export const ProfileFriendsViewer = profileFriendsFabric.Viewer;
export const isViewAtom = profileFriendsFabric.isViewAtom
export const isExistAtom = profileFriendsFabric.isExistAtom