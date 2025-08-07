import { atom } from "@reatom/core";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { Friend, GetFriendsResponse } from "@repo/types/schemas/friend/friend-types.ts";
import { sleep, take, withReset } from "@reatom/framework";
import { forumUserClient } from "#shared/forum-client";
import * as z from "zod";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { decode } from "cbor-x"
import ky from "ky";
import { parseBooleanToString } from "@repo/lib/helpers/parse-boolean-to-string.ts"
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { friendsUpdateOptionsAtom } from "../components/filtering/models/friends-filtering.model";
import { logger } from "@repo/lib/utils/logger";

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

export async function getFriends({
  nickname, sort_type, ascending, cursor, limit
}: GetFriends): Promise<GetFriendsResponse | null> {
  const url = forumUserClient.user["get-friends"][":nickname"].$url({
    param: { nickname },
    query: {
      sort_type,
      ascending: parseBooleanToString(ascending),
      cursor,
      limit: limit ? `${limit}` : undefined
    },
  })

  const res = await ky.get(url, { credentials: "include" })
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

  await sleep(200)

  const nickname = ctx.get(currentUserNicknameAtom)
  if (!nickname) return;

  const { sort_type, ascending, limit } = ctx.get(friendsUpdateOptionsAtom)

  return await ctx.schedule(() => getFriends({ nickname, limit, sort_type, ascending }))
}, {
  name: "myFriendsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    myFriendsDataAtom(ctx, res.data)
    myFriendsMetaAtom(ctx, res.meta)
    friendsUpdateOptionsAtom(ctx, (state) => ({ ...state, cursor: res.meta?.endCursor }))
  }
}).pipe(withStatusesAtom())

myFriendsDataAtom.onChange((_, v) => import.meta.env.DEV && logger.info("myFriendsDataAtom", v))
myFriendsMetaAtom.onChange((_, v) => import.meta.env.DEV && logger.info("myFriendsMetaAtom", v))