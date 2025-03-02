import { FriendsSortType } from "#components/profile/friends/queries/friends-settings-query.ts";

export type FriendsSort = {
  name: string;
  value: FriendsSortType;
};

export const FRIENDS_SORT: FriendsSort[] = [
  { name: "По дате добавления", value: "created_at" },
  { name: "По привилегии", value: "donate_weight" },
];
