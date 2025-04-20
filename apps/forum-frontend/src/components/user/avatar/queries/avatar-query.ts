import { useSuspenseQuery } from '@tanstack/react-query';
import { getSkinDetails } from '@repo/lib/queries/get-skin-details';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const USER_AVATAR_QUERY_KEY = (nickname: string) =>
  createQueryKey('ui', ['avatar'], nickname);

export const userAvatarQuery = (nickname: string) => useSuspenseQuery({
  queryKey: USER_AVATAR_QUERY_KEY(nickname),
  queryFn: () => getSkinDetails({ type: 'head', nickname }),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  gcTime: Infinity,
  staleTime: Infinity,
  retry: 1
});