import { useQuery } from '@tanstack/react-query';
import { GetCategoryThreads, getCategoryThreads, RequestProperties } from './get-category-threads.ts';

export const CATEGORY_THREADS_QUERY_KEY = (categoryId: string) =>
  ["ui", "category-threads", categoryId]

export type CategoryThreadsQuery = Pick<GetCategoryThreads, "categoryId">
  & Partial<RequestProperties>

export const categoryThreadsQuery = ({
  categoryId, limit = 12, range
}: CategoryThreadsQuery) => useQuery({
  queryKey: CATEGORY_THREADS_QUERY_KEY(categoryId),
  queryFn: () => getCategoryThreads({ categoryId, limit, range }),
  refetchOnWindowFocus: false
})