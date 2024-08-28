import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSearchingFriends } from './get-searching-friends.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';

export const SEARCHING_FRIENDS_QUERY_KEY = (nickname?: string) => ["user", "friends", "searching", nickname]

export const searchingFriends = () => {
  const qc = useQueryClient()
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  
  return useQuery({
    queryKey: SEARCHING_FRIENDS_QUERY_KEY(currentUser?.nickname),
    queryFn: () => getSearchingFriends(),
    refetchOnWindowFocus: true,
    retryOnMount: true
  })
}