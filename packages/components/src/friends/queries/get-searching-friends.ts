"use server";

import "server-only";
import {
  ExtendedUsers,
  getUsers,
} from "#admin/components/dashboard/queries/get-users.ts";
import { getFriends } from "./get-friends.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export type SearchingFriend = Omit<ExtendedUsers, "uuid">;

export async function getSearchingFriends(): Promise<SearchingFriend[] | null> {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const [users, friends] = await Promise.all([
    getUsers({ withDonate: true }),
    getFriends({ nickname: currentUser.nickname }),
  ]);

  if (!users) return null;

  if (!friends)
    return users.data.filter(
      (u) => u.nickname !== currentUser.nickname,
    ) as ExtendedUsers[];

  return users.data.filter(
    (u) =>
      u.nickname !== currentUser.nickname &&
      !friends.some((friend) => friend.nickname === u.nickname),
  ) as ExtendedUsers[];
}
