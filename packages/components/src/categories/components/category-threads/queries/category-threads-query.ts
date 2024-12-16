import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  GetCategoryThreads,
  getCategoryThreads,
} from './get-category-threads.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const CATEGORY_THREADS_QUERY_KEY = (categoryId: string) =>
  createQueryKey('ui', [ 'category-threads' ], categoryId);

export type CategoryThreadsQuery = GetCategoryThreads;

export const categoryThreadsQuery = ({
  category_id, limit = 12, range,
}: CategoryThreadsQuery) => useQuery({
  queryKey: CATEGORY_THREADS_QUERY_KEY(category_id),
  queryFn: () => getCategoryThreads({ category_id, limit, range }),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData
});