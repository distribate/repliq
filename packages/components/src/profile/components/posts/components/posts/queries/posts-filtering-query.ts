import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export type PostsFilteringQuery = {
  searchQuery: string | null,
  filteringType: "created_at" | "views"
}

export const POSTS_FILTERING_QUERY_KEY = createQueryKey("ui", ["posts", "filtering"])

const initial: PostsFilteringQuery = {
  searchQuery: null,
  filteringType: "created_at"
}

export const postsFilteringQuery = () => useQuery<
  PostsFilteringQuery, Error
>({
  queryKey: POSTS_FILTERING_QUERY_KEY,
  refetchOnWindowFocus: false,
  retry: 1,
  initialData: initial
});