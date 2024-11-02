import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSearchingFriends } from './get-searching-friends.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const SEARCHING_FRIENDS_QUERY_KEY = (nickname?: string) =>
  ["user", "friends", "searching", nickname]

export const searchingFriends = () => {
  const currentUser = getUser();
  
  return useQuery({
    queryKey: SEARCHING_FRIENDS_QUERY_KEY(currentUser?.nickname),
    queryFn: () => getSearchingFriends(),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  })
}