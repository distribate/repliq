import { useSuspenseQuery } from '@tanstack/react-query';
import { getSkinDetails } from '@repo/lib/helpers/get-skin-details';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const USER_AVATAR_QUERY_KEY = (nickname: string) => createQueryKey("ui", ["avatar"], nickname);

export const userAvatarQuery = (nickname: string) => useSuspenseQuery({
  queryKey: USER_AVATAR_QUERY_KEY(nickname),
  queryFn: () => getSkinDetails({ nickname, type: 'head' }),
  refetchOnWindowFocus: false,
  gcTime: Infinity,
  staleTime: Infinity
});