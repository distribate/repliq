import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const SEARCH_QUERY_KEY = [ 'ui', 'search-state' ];

export type SearchUser = {
  nickname: string,
  name_color: string
}

export type SearchTopic = {
  title: string,
  id: string
}

export type SearchType = 'users' | 'threads'

export type SearchResults = SearchUser[] | SearchTopic[]

export type SearchQuery = Partial<{
  type: SearchType,
  results: SearchResults | null,
  value: string
}>

const initial: SearchQuery = {
  type: 'users',
  results: null,
};

export const searchQuery = () => {
  return useQuery<SearchQuery, Error>({
    queryKey: SEARCH_QUERY_KEY,
    initialData: initial,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000,
    placeholderData: keepPreviousData,
  });
};