import { getUserFriendsSchema } from '@repo/types/schemas/user/get-user-friends-schema';
import { z } from "zod/v4";
import { atom } from '@reatom/core';

export type FriendsSortType = "created_at" | "donate_weight";

export type FriendsSortQuery = Omit<z.infer<typeof getUserFriendsSchema>, "with_details"> & {
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