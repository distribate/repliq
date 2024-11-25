import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRequestedUser, RequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { CurrentUser } from '@repo/lib/queries/current-user-query.ts';

export const REQUESTED_USER_QUERY_KEY = (nickname: string) =>
  [ 'user', 'requested', nickname ];

type RequestedUserQuery = {
  nickname: string,
}

export const requestedUserQuery = ({
  nickname
}: RequestedUserQuery) => {
  const qc = useQueryClient();
  const currentUser = getUser();
  const isOwnProfile = currentUser && currentUser.nickname === nickname;
  
  if (isOwnProfile) {
    qc.setQueryData(REQUESTED_USER_QUERY_KEY(nickname), currentUser)
    return { data: currentUser, isLoading: false }
  }
  
  return useQuery<RequestedUser | null, Error>({
    queryKey: REQUESTED_USER_QUERY_KEY(nickname),
    queryFn: () => getRequestedUser(nickname),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !isOwnProfile
  });
}