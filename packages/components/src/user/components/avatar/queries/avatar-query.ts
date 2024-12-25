import { useSuspenseQuery } from '@tanstack/react-query';
import { getHeadDetails } from '@repo/lib/helpers/get-skin-details';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const USER_AVATAR_QUERY_KEY = (nickname: string) =>
  createQueryKey('ui', [ 'avatar' ], nickname);

export const userAvatarQuery = (nickname: string) => useSuspenseQuery({
  queryKey: USER_AVATAR_QUERY_KEY(nickname),
  queryFn: () => getHeadDetails(nickname),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  gcTime: Infinity,
  staleTime: Infinity,
});