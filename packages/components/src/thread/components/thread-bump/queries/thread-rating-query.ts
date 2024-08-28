import { useQuery } from '@tanstack/react-query';
import { getThreadRating, ThreadRatingResponse } from '../../../queries/get-thread-rating.ts';

export const THREAD_RATING_QUERY_KEY = (thread_id?: string) => [ 'ui', 'thread-rating', thread_id ];

export const threadRatingQuery = (thread_id?: string) => {
  return useQuery<ThreadRatingResponse | null, Error>({
    queryKey: THREAD_RATING_QUERY_KEY(thread_id),
    queryFn: () => getThreadRating(thread_id),
    enabled: !!thread_id
  });
};