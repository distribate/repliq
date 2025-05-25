import { useSuspenseQuery } from '@tanstack/react-query';
import { getSkinDetails } from '@repo/lib/queries/get-skin-details';

export const USER_AVATAR_QUERY_KEY = (nickname: string) => ['ui', 'avatar', nickname];

export const userAvatarQuery = (nickname: string) => useSuspenseQuery({
  queryKey: USER_AVATAR_QUERY_KEY(nickname),
  queryFn: () => getSkinDetails({ type: 'head', nickname }),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  gcTime: Infinity,
  staleTime: Infinity,
});