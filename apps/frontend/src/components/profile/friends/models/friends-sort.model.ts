import { getUserFriendsSchema } from '@repo/types/schemas/user/get-user-friends-schema';
import * as z from "zod";
import { atom } from '@reatom/core';

export type FriendsSortType = "created_at" | "donate_weight";

export type FriendsSortQuery = z.infer<typeof getUserFriendsSchema> & {
  searchQuery: string;
  type: "first" | "other",
  cursor?: string
}

const initial: FriendsSortQuery = {
  sort_type: "created_at",
  searchQuery: "",
  type: "first",
  ascending: false
};

export const friendsSortAtom = atom<FriendsSortQuery>(initial, "friendsSort")