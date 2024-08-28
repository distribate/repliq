import { useQuery } from '@tanstack/react-query';

export type FriendsFilteringViewType = 'grid' | 'list'
export type FriendsFilteringSortType = 'date' | 'abc'

export type FriendsFilteringQuery = {
  searchValue: string | null,
  viewType: FriendsFilteringViewType,
  sortType: FriendsFilteringSortType,
}

export const FRIENDS_FILTERING_QUERY_KEY = [ 'ui', 'friends', 'filtering' ];

const initial: FriendsFilteringQuery = {
  searchValue: null,
  viewType: 'list',
  sortType: 'date',
};

export const friendsFilteringQuery = () => useQuery<FriendsFilteringQuery, Error>({
  queryKey: FRIENDS_FILTERING_QUERY_KEY,
  initialData: initial,
  gcTime: Infinity,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
});