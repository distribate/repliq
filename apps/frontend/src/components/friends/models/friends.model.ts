import * as z from "zod";
import { atom, batch, Ctx } from "@reatom/core";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { withReset } from "@reatom/framework";
import { userClient } from "#shared/forum-client";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { AsyncCtx } from "@reatom/async";
import { createFabric } from "#shared/models/infinity-scroll.model";
import { friendsListTypeAtom, resetFriendsOpts } from "../components/filtering/models/friends-filtering.model";
import { incomingRequestsAtom, outgoingRequestsAtom } from "./friends-requests.model";
import { recommendedFriendsAction } from "./recommended-friends.model";
import { validateResponse } from "#shared/api/validation";

export type FriendsOpts = z.infer<typeof getUserFriendsSchema>

export type FriendsPayload = Awaited<ReturnType<typeof getMyFriends>>;
export type FriendsPayloadData = NonNullable<FriendsPayload>["data"]
export type FriendsPayloadMeta = NonNullable<FriendsPayload>["meta"]

export const myFriendsDataAtom = atom<FriendsPayloadData | null>(null, "myFriendsData").pipe(withReset())
export const myFriendsMetaAtom = atom<FriendsPayloadMeta | null>(null, "myFriendsMeta").pipe(withReset())
export const myFriendsPinnedDataAtom = atom<FriendsPayloadData>([], "myFriendsPinnedData").pipe(withReset())
export const myFriendsNotPinnedDataAtom = atom<FriendsPayloadData>([], "myFriendsNotPinnedData").pipe(withReset())

export const myFriendsCursorAtom = atom<string | undefined>(undefined, "myFriendsCursor")
export const myFriendsAscendingAtom = atom(false, "myFriendsAscending")
export const myFriendsLimitAtom = atom(12, "myFriendsLimit")
export const myFriendsSortTypeAtom = atom<"donate_weight" | "created_at">("created_at", "myFriendsSortType")
export const myFriendsTypeAtom = atom<"first" | "other">("first", "myFriendsType")

async function getMyFriends(
  { sort_type, ascending, cursor, limit, searchQuery }: FriendsOpts,
  init?: RequestInit
) {
  const res = await userClient.user["my-friends"].$get({
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

export function resetFriends(ctx: Ctx) {
  function resetMyFriendsData(ctx: Ctx) {
    myFriendsDataAtom.reset(ctx);
    myFriendsMetaAtom.reset(ctx);
    myFriendsPinnedDataAtom.reset(ctx)
    myFriendsNotPinnedDataAtom.reset(ctx)
  }

  function resetFriendsRequestsData(ctx: Ctx) {
    incomingRequestsAtom.reset(ctx)
    outgoingRequestsAtom.reset(ctx)
  }

  function resetSearchFriends(ctx: Ctx) {
    recommendedFriendsAction.dataAtom.reset(ctx)
  }

  friendsListTypeAtom.reset(ctx)

  batch(ctx, () => {
    resetMyFriendsData(ctx)
    resetFriendsRequestsData(ctx)
    resetSearchFriends(ctx)
    resetFriendsOpts(ctx)
  })
}

myFriendsDataAtom.onChange((ctx, state) => {
  if (state && state.length >= 1) {
    batch(ctx, () => {
      myFriendsPinnedDataAtom(ctx, state.filter(exist => exist.is_pinned))
      myFriendsNotPinnedDataAtom(ctx, state.filter(exist => exist.is_pinned === false))
    })
  }
})

function getCache(ctx: Ctx) {
  return {
    data: ctx.get(myFriendsDataAtom),
    meta: ctx.get(myFriendsMetaAtom)
  }
}

export const myFriendsAction = reatomAsync(async (ctx) => {
  const cache = getCache(ctx)
  if (cache.data) return cache

  return await ctx.schedule(() => friendsFn(ctx))
}, {
  name: "myFriendsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      myFriendsDataAtom(ctx, res.data)
      myFriendsMetaAtom(ctx, res.meta)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withStatusesAtom())

async function friendsFn(ctx: AsyncCtx) {
  const sort_type = ctx.get(myFriendsSortTypeAtom)
  const cursor = ctx.get(myFriendsCursorAtom)
  const asc = ctx.get(myFriendsAscendingAtom)
  const limit = ctx.get(myFriendsLimitAtom)

  const opts = { ascending: asc, sort_type, cursor, limit }

  const result = await ctx.schedule(
    () => getMyFriends(opts, { signal: ctx.controller.signal })
  );

  return result
}

const friendsFabric = createFabric<FriendsPayloadData[number], FriendsPayloadMeta>({
  name: 'myFriends',
  key: 'nickname',
  fn: friendsFn,
  atoms: {
    dataAtom: myFriendsDataAtom,
    metaAtom: myFriendsMetaAtom,
    cursorAtom: myFriendsCursorAtom
  },
  viewerOpts: {
    threshold: 1
  }
});

export const updateFriendsAction = friendsFabric.update;
export const FriendsViewer = friendsFabric.Viewer;
export const isViewAtom = friendsFabric.isViewAtom
export const isExistAtom = friendsFabric.isExistAtom