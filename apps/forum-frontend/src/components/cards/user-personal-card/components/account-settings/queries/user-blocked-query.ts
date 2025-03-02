import { useQuery } from '@tanstack/react-query';
import { getUserBlocked } from './get-user-blocked.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const USER_BLOCKED_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["blocked"], nickname)

export const userBlockedQuery = (nickname: string) => useQuery({
  queryKey: USER_BLOCKED_QUERY_KEY(nickname),
  queryFn: () => getUserBlocked(nickname),
  refetchOnWindowFocus: false,
  refetchOnMount: false
});