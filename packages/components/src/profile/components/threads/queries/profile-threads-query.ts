import { useQuery } from '@tanstack/react-query';
import { getThreadsUser, UserThreads } from './get-threads-user.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const THREADS_QUERY_KEY = (nickname: string) =>
  createQueryKey('user', [ 'threads' ], nickname);

export const profileThreadsQuery = (nickname: string) => useQuery<UserThreads[] | null>({
  queryKey: THREADS_QUERY_KEY(nickname),
  queryFn: async () => {
    const result = await getThreadsUser({ nickname });
    return result ?? null;
  },
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});
