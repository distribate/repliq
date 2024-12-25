import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const POSTS_DEFAULT_MAX_RANGE = 8;

export type PostsFilteringQuery = {
  searchQuery: string | null;
  filteringType: 'created_at' | 'views_count';
  range: number[],
  ascending: boolean
};

export const POSTS_FILTERING_QUERY_KEY = createQueryKey('ui', [
  'posts',
  'filtering',
]);

const initial: PostsFilteringQuery = {
  searchQuery: null,
  filteringType: 'created_at',
  range: [0, POSTS_DEFAULT_MAX_RANGE],
  ascending: false,
};

export const postsFilteringQuery = () => useQuery<
  PostsFilteringQuery, Error
>({
  queryKey: POSTS_FILTERING_QUERY_KEY,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  initialData: initial,
});
