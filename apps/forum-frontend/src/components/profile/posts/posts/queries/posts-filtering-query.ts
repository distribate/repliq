import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const POSTS_DEFAULT_MAX_RANGE = 8;

export type PostsFilteringQuery = {
  searchQuery?: string;
  filteringType: 'created_at' | 'views_count';
  ascending: boolean;
  cursor?: string
};

export const POSTS_FILTERING_QUERY_KEY = createQueryKey('ui', [
  'posts',
  'filtering',
]);

const initial: PostsFilteringQuery = {
  filteringType: 'created_at',
  ascending: false,
};

export const postsFilteringQuery = () => useQuery<PostsFilteringQuery, Error>({
  queryKey: POSTS_FILTERING_QUERY_KEY,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  initialData: initial,
});