import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { forumCategoriesClient } from '@repo/shared/api/forum-client.ts';

async function getCategoryThreads({
  id, limit = 12, cursor, ascending = true
}: {
  id: string,
  limit?: number,
  ascending?: boolean
  cursor?: string
}) {
  const res = await forumCategoriesClient.categories["get-category-threads"][":id"].$get({
    param: { id },
    query: {
      limit: `${limit}`, 
      ascending: `${ascending}`,
      cursor
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data;
}

export const CATEGORY_THREADS_QUERY_KEY = (categoryId: string) =>
  createQueryKey('ui', ['category-threads'], categoryId);

export const categoryThreadsQuery = ({
  id, limit = 12, cursor,
}: {
  id: string,
  limit?: number,
  cursor?: string
}) => useQuery({
  queryKey: CATEGORY_THREADS_QUERY_KEY(id),
  queryFn: () => getCategoryThreads({ id, limit, cursor }),
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData
});