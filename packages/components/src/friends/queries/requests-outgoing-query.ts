import { useQuery } from '@tanstack/react-query';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { getRequestsByType } from '#friends/queries/get-requests-by-type.ts';

export const REQUESTS_OUTGOING_QUERY_KEY = (nickname?: string) =>
  [ 'user', 'friends', 'outgoing', nickname ];

export const requestsOutgoingQuery = (
  enabled: boolean = true
) => {
  const currentUser = getUser();
  
  return useQuery({
    queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser?.nickname),
    queryFn: () => getRequestsByType({
      type: 'outgoing', nickname: currentUser?.nickname,
    }),
    enabled: !!currentUser && !!currentUser.nickname && enabled,
  });
};