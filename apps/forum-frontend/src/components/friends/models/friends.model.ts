import { atom } from "@reatom/core";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { FriendWithDetails, GetFriendsResponse } from "@repo/types/schemas/friend/friend-types.ts";
import { sleep, take, withReset } from "@reatom/framework";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { z } from "zod/v4";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { decode } from "cbor-x"
import ky from "ky";
import { parseBooleanToString } from "@repo/lib/helpers/parse-boolean-to-string.ts"
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import { friendsUpdateOptionsAtom } from "../components/filtering/models/friends-filtering.model";
import { logger } from "@repo/lib/utils/logger";

export type FriendsQuery = {
  with_details?: boolean
  sort_type?: "created_at" | "donate_weight"
  ascending?: boolean;
  limit?: number;
};

export type GetFriends = Pick<UserEntity, "nickname"> & z.infer<typeof getUserFriendsSchema>

function isFriendDetailed(input: GetFriendsResponse["data"][number]): input is FriendWithDetails {
  return "is_pinned" in input && input.is_pinned !== undefined;
}

export const myFriendsDataAtom = atom<FriendWithDetails[] | null>(null, "myFriendsData").pipe(withReset())
export const myFriendsMetaAtom = atom<GetFriendsResponse["meta"] | null>(null, "myFriendsMeta").pipe(withReset())
export const myFriendsPinnedDataAtom = atom<FriendWithDetails[]>([], "myFriendsPinnedData").pipe(withReset())
export const myFriendsNotPinnedDataAtom = atom<FriendWithDetails[]>([], "myFriendsNotPinnedData").pipe(withReset())

myFriendsDataAtom.onChange((_, state) => logger.info("myFriendsDataAtom", state))
myFriendsMetaAtom.onChange((_, state) => logger.info("myFriendsMetaAtom", state))

myFriendsDataAtom.onChange((ctx, state) => {
  if (state && state.length > 0 && state.every(isFriendDetailed)) {
    myFriendsPinnedDataAtom(ctx,
      (state as FriendWithDetails[])
        .filter(exist => exist.is_pinned)
    )

    myFriendsNotPinnedDataAtom(ctx,
      (state as FriendWithDetails[])
        .filter(exist => exist.is_pinned === false)
    )
  }
})

export async function getFriends({
  nickname, sort_type, with_details, ascending, cursor, limit
}: GetFriends): Promise<GetFriendsResponse | null> {
  const url = forumUserClient.user["get-user-friends"][":nickname"].$url({
    param: { nickname },
    query: {
      sort_type,
      with_details: parseBooleanToString(with_details),
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
  console.log(ctx.get(myFriendsDataAtom))
  if (ctx.get(myFriendsDataAtom)) {
    const cache = { data: ctx.get(myFriendsDataAtom), meta: ctx.get(myFriendsMetaAtom) }
    console.log('cache', cache)
    return cache
  }

  await sleep(200)
  
  let nickname = ctx.get(currentUserNicknameAtom)

  if (!nickname) {
    nickname = await take(ctx, currentUserNicknameAtom)
  }

  if (!nickname) return;

  const { sort_type, ascending, limit } = ctx.get(friendsUpdateOptionsAtom)

  return await ctx.schedule(() => getFriends({ nickname, with_details: true, limit, sort_type, ascending }))
}, {
  name: "myFriendsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;
    
    myFriendsDataAtom(ctx, res.data as FriendWithDetails[])
    myFriendsMetaAtom(ctx, res.meta)
    friendsUpdateOptionsAtom(ctx, (state) => ({ ...state, cursor: res.meta?.endCursor }))
  }
}).pipe(withStatusesAtom())