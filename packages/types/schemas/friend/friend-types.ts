export type Friend = {
  friend_id: string;
  created_at: string | Date;
  nickname: string;
  avatar: string | null,
  description: string | null;
  real_name: string | null;
  name_color: string;
  is_donate: boolean
  note: string | null;
  is_pinned: boolean;
};

export type GetFriendsResponse = {
  data: Friend[]
  meta: {
    hasNextPage: boolean
    hasPrevPage: boolean
    endCursor: string | undefined;
    startCursor: string | undefined;
  }
}