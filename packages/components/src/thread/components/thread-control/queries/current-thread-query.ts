import { useQuery } from '@tanstack/react-query';
import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { getCurrentThread } from './get-current-thread.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const CURRENT_THREAD_QUERY_KEY = (threadId: string) => createQueryKey("user", ["thread"], threadId);

export const currentThreadQuery = (
  threadId: Pick<ThreadModel, 'id'>['id'],
) => useQuery({
  queryKey: CURRENT_THREAD_QUERY_KEY(threadId),
  queryFn: () => getCurrentThread(threadId),
  refetchOnWindowFocus: false,
});