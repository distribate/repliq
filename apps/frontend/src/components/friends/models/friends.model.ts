import { atom, batch, Ctx } from "@reatom/core";
import { reatomAsync, withCache, withStatusesAtom } from "@reatom/async";
import { Friend, GetFriendsResponse } from "@repo/types/schemas/friend/friend-types.ts";
import { withReset } from "@reatom/framework";
import { userClient } from "#shared/forum-client";
import * as z from "zod";
import ky from "ky";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { decode } from "cbor-x"
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { friendsUpdateOptionsAtom } from "../components/filtering/models/friends-filtering.model";

export type FriendsQuery = {
  sort_type?: "created_at" | "donate_weight"
  ascending?: boolean;
  limit?: number;
};

export type GetFriends = { nickname: string } & z.infer<typeof getUserFriendsSchema>

function isFriendDetailed(input: GetFriendsResponse["data"][number]): input is Friend {
  return "is_pinned" in input && input.is_pinned !== undefined;
}

export const myFriendsDataAtom = atom<Friend[] | null>(null, "myFriendsData").pipe(withReset())
export const myFriendsMetaAtom = atom<GetFriendsResponse["meta"] | null>(null, "myFriendsMeta").pipe(withReset())
export const myFriendsPinnedDataAtom = atom<Friend[]>([], "myFriendsPinnedData").pipe(withReset())
export const myFriendsNotPinnedDataAtom = atom<Friend[]>([], "myFriendsNotPinnedData").pipe(withReset())

export function resetMyFriends(ctx: Ctx) {
  myFriendsDataAtom.reset(ctx);
  myFriendsMetaAtom.reset(ctx);
  myFriendsPinnedDataAtom.reset(ctx)
  myFriendsNotPinnedDataAtom.reset(ctx)
}

myFriendsDataAtom.onChange((ctx, state) => {
  if (state && state.length > 0 && state.every(isFriendDetailed)) {
    myFriendsPinnedDataAtom(ctx,
      (state as Friend[])
        .filter(exist => exist.is_pinned)
    )

    myFriendsNotPinnedDataAtom(ctx,
      (state as Friend[])
        .filter(exist => exist.is_pinned === false)
    )
  }
})

const parseBooleanToString = (input: boolean): "true" | "false" => {
  if (input === true) {
    return "true";
  } else if (input === false) {
    return "false";
  }

  throw new Error(`Invalid string boolean: ${input}`);
};

export async function getFriends(
  { nickname, sort_type, ascending, cursor, limit }: GetFriends,
  init?: RequestInit
): Promise<GetFriendsResponse | null> {
  const url = userClient.user["get-friends"][":nickname"].$url({
    param: { nickname },
    query: {
      sort_type,
      ascending: parseBooleanToString(ascending),
      cursor,
      limit: limit ? `${limit}` : undefined
    },
  })

  const res = await ky.get(url, { credentials: "include", ...init })
  const encodedData = await res.arrayBuffer()

  if (!encodedData) return null;

  const uint8Data = new Uint8Array(encodedData);
  const data: GetFriendsResponse | { error: string } = decode(uint8Data);

  if (!data || "error" in data) return null;

  return data;
}

export const myFriendsAction = reatomAsync(async (ctx) => {
  const cache = ctx.get(myFriendsDataAtom)

  if (cache) {
    return {
      data: ctx.get(myFriendsDataAtom),
      meta: ctx.get(myFriendsMetaAtom)
    }
  }

  const nickname = ctx.get(currentUserNicknameAtom)
  if (!nickname) return;

  const { sort_type, ascending, limit } = ctx.get(friendsUpdateOptionsAtom)

  return await ctx.schedule(() => getFriends(
    { nickname, limit, sort_type, ascending },
    { signal: ctx.controller.signal }
  ))
}, {
  name: "myFriendsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      myFriendsDataAtom(ctx, res.data)
      myFriendsMetaAtom(ctx, res.meta)
      friendsUpdateOptionsAtom(ctx, (state) => ({ ...state, cursor: res.meta?.endCursor }))
    })
  }
}).pipe(withStatusesAtom(), withCache({ swr: false }))