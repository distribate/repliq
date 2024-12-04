import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFriends } from "./get-friends.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { friendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";

export const FRIENDS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["friends"], nickname);

export type FriendsQuery = {
  nickname: string;
  enabled?: boolean;
};

export const friendsQuery = ({ nickname, enabled = true }: FriendsQuery) => {
  const { data: friendSortType } = friendsSortQuery();
  const { type: orderType } = friendSortType;

  return useQuery({
    queryKey: FRIENDS_QUERY_KEY(nickname),
    queryFn: () => getFriends({ nickname, orderType }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!nickname && enabled,
  });
};
