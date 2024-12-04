import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSearchingFriends } from "./get-searching-friends.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const SEARCHING_FRIENDS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["friends", "searching"], nickname);

export const searchingFriends = () => {
  const currentUser = getUser();

  return useQuery({
    queryKey: SEARCHING_FRIENDS_QUERY_KEY(currentUser.nickname),
    queryFn: () => getSearchingFriends(),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
