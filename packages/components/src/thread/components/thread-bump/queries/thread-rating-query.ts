import { useQuery } from '@tanstack/react-query';
import { getThreadRating } from '../../../queries/get-thread-rating.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const THREAD_RATING_QUERY_KEY = (thread_id: string) => createQueryKey('ui', ['thread-rating'], thread_id);

export const threadRatingQuery = (thread_id: string) => useQuery({
  queryKey: THREAD_RATING_QUERY_KEY(thread_id),
  queryFn: () => getThreadRating(thread_id)
});