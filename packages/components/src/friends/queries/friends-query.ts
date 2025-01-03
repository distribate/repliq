import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFriends } from "./get-friends.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { friendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";

export const FRIENDS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["friends"], nickname);

export type FriendsQuery = {
  nickname: string
  with_details?: boolean
};

export const friendsQuery = ({ 
  nickname, with_details = true
}: FriendsQuery) => {
  const { sort_type, searchQuery, range, ascending } = friendsSortQuery().data;

  return useQuery({
    queryKey: FRIENDS_QUERY_KEY(nickname),
    queryFn: () => getFriends({ 
      nickname, with_details, sort_type, searchQuery, range, ascending
    }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  });
};