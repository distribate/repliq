import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { getSearchRelated } from '#search/queries/get-search-related.ts';

export const RELATED_QUERY_KEY = createQueryKey("ui", ["related"])

export const relatedQuery = () => useQuery({
  queryKey: RELATED_QUERY_KEY,
  queryFn: () => getSearchRelated(),
  placeholderData: keepPreviousData,
  retry: 1,
  refetchOnMount: false,
  refetchOnWindowFocus: false
})