import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriends } from "./get-friends.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { FRIENDS_SORT_QUERY_KEY, FriendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";

export const FRIENDS_QUERY_KEY = (nickname: string) => createQueryKey("user", ["friends"], nickname);

export type FriendsQuery = {
  nickname: string
  with_details?: boolean
  sort_type?: "created_at" | "donate_weight"
  ascending?: boolean;
  limit?: number;
};

export const friendsQuery = ({
  nickname, with_details = true, sort_type, ascending, limit
}: FriendsQuery) => {
  const qc = useQueryClient();

  return useQuery({
    queryKey: FRIENDS_QUERY_KEY(nickname),
    queryFn: async () => {
      const res = await getFriends({ 
        nickname, with_details, limit, sort_type: sort_type ?? "created_at", ascending: ascending ?? true 
      })

      if (!res) return null;

      qc.setQueryData(FRIENDS_SORT_QUERY_KEY, (prev: FriendsSortQuery) =>
        ({ ...prev, cursor: res.meta?.endCursor })
      )

      return res
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}