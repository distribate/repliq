import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFriends } from "./get-friends.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { friendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema.ts";
import { z } from "zod";

export const FRIENDS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["friends"], nickname);

type F = z.infer<typeof getUserFriendsSchema>

export type FriendsQuery = Pick<F, "with_details"> & {
  nickname: string
};

export const friendsQuery = ({ 
  nickname, with_details
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