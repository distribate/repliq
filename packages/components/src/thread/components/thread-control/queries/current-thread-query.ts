import { useQuery } from '@tanstack/react-query';
import { ThreadModel } from '../../../queries/get-thread.ts';
import { getCurrentThread } from './get-current-thread.ts';

export const CURRENT_THREAD_QUERY_KEY = (thread_id: string) => {
  return [ 'ui', 'thread', thread_id ];
};

export const currentThreadQuery = (thread_id: Pick<ThreadModel, 'id'>['id']) => {
  return useQuery({
    queryKey: CURRENT_THREAD_QUERY_KEY(thread_id),
    queryFn: () => getCurrentThread({
      id: thread_id
    }),
    enabled: !!thread_id,
  });
};