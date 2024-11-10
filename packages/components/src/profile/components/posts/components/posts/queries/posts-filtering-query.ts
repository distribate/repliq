import { useQuery } from '@tanstack/react-query';

export type PostsFilteringQuery = {
  searchQuery: string | null,
  filteringType: "created_at" | "views"
}

export const POSTS_FILTERING_QUERY_KEY = [ 'ui', 'posts', 'filter' ];

export const postsFilteringQuery = () => useQuery<
  PostsFilteringQuery, Error
>({
  queryKey: POSTS_FILTERING_QUERY_KEY,
  refetchOnWindowFocus: false,
  retry: 1,
  initialData: {
    searchQuery: null,
    filteringType: "created_at"
  }
});