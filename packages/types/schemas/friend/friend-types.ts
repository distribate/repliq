import type { DonateVariantsEnum } from "../../entities/entities-type";

export type GetFriendsResponse = {
  data: FriendWithDetails[] | FriendWithoutDetails[]
  meta: Partial<{
    hasNextPage: boolean
    hasPrevPage: boolean
    endCursor: string;
    startCursor: string;
  }>
}

export type FriendWithDetails = {
  friend_id: string;
  created_at: string;
  nickname: string;
  description: string | null;
  real_name: string | null;
  name_color: string;
  favorite_item: number | null;
  is_donate: boolean
  note: string | null;
  is_pinned: boolean;
  donate_weight: number | null;
};

export type FriendWithoutDetails = {
  friend_id: string
  nickname: string;
  name_color: string;
};