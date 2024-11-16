import { useSuspenseQuery } from '@tanstack/react-query';
import { getSkinDetails } from '@repo/lib/helpers/get-skin-details';

export const USER_AVATAR_QUERY_KEY = (nickname: string) =>
  [ 'user', 'avatar', nickname ];

export const userAvatarQuery = (nickname: string) => useSuspenseQuery({
  queryKey: USER_AVATAR_QUERY_KEY(nickname),
  queryFn: () => getSkinDetails({ nickname, type: 'head' }),
  refetchOnWindowFocus: false,
  gcTime: Infinity,
  staleTime: Infinity
});