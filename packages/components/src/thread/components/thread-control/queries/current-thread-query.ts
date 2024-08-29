import { useQuery } from '@tanstack/react-query';
import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { getCurrentThread } from './get-current-thread.ts';

export const CURRENT_THREAD_QUERY_KEY = (threadId: string) => [ 'ui', 'thread', threadId ];

export const currentThreadQuery = (
  threadId: Pick<ThreadModel, 'id'>['id']
) => {
  return useQuery({
    queryKey: CURRENT_THREAD_QUERY_KEY(threadId),
    queryFn: () => getCurrentThread({ id: threadId }),
    refetchOnWindowFocus: false,
    enabled: !!threadId
  });
};