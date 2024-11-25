import { useQuery } from '@tanstack/react-query';
import { GetThreadsUser, getThreadsUser } from './get-threads-user.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const THREADS_QUERY_KEY = (nickname: string) => createQueryKey('user', [ 'threads' ], nickname);

type ThreadsQuery = GetThreadsUser;

export const threadsQuery = ({
  nickname, order, ascending,
}: ThreadsQuery) => useQuery({
  queryKey: THREADS_QUERY_KEY(nickname),
  queryFn: () => getThreadsUser({ nickname, ascending, order }),
  refetchOnWindowFocus: false
});