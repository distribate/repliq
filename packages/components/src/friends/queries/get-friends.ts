import {
  UserEntity,
} from "@repo/types/entities/entities-type.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { z } from "zod";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";
import { type FriendWithDetails, type FriendWithoutDetails } from '@repo/types/schemas/friend/friend-types';

export type RequestFriends = Pick<UserEntity, "nickname"> & z.infer<typeof getUserFriendsSchema>

export async function getFriends({
  nickname, range, searchQuery, sort_type, with_details, ascending,
}: RequestFriends): Promise<FriendWithDetails[] | FriendWithoutDetails[] | null> {
  const res = await forumUserClient().user["get-user-friends"][":nickname"].$get({
    query: {
      with_details: with_details.toString(),
      sort_type,
      ascending: ascending.toString(),
      searchQuery,
      range: range.join(",")
    },
    param: { nickname }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  if (!data.length) {
    return null
  }

  return data
}