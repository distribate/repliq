import {
  UserEntity,
} from "@repo/types/entities/entities-type.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { z } from "zod";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { GetFriendsResponse } from '@repo/types/schemas/friend/friend-types';
import { decode } from "cbor-x"
import ky from "ky";
import { parseBooleanToString } from "@repo/lib/helpers/parse-boolean-to-string.ts"

export type GetFriends = Pick<UserEntity, "nickname"> & z.infer<typeof getUserFriendsSchema>

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

  const res = await ky.get(url, {
    credentials: "include",
  })

  const encodedData = await res.arrayBuffer()

  if (!encodedData) {
    return null;
  }

  const uint8Data = new Uint8Array(encodedData);

  const data: GetFriendsResponse | { error: string } = decode(uint8Data);

  if (!data || "error" in data) {
    return null;
  }

  return data;
}