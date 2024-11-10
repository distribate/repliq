import { FriendsSort as FriendsSortType } from '#profile/components/friends/hooks/use-friends-sort.tsx';

export type FriendsSort = {
  title: string,
  value: FriendsSortType
}

export const FRIENDS_SORT: FriendsSort[] = [
  { title: "По дате добавления", value: "created_at" },
  { title: "По привилегии", value: "donate" }
]