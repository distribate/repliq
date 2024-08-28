import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FRIENDS_FILTERING_QUERY_KEY, FriendsFilteringQuery } from '../queries/friends-filtering-query.ts';

type FriendsActionType = 'view' | 'sort' | 'search'

type FriendsActionMutation = {
  type: FriendsActionType,
  value: string
    | Pick<FriendsFilteringQuery, 'sortType'>
    | Pick<FriendsFilteringQuery, 'viewType'>
    | null
}

export const useFriendSort = () => {
  const qc = useQueryClient();
  
  const setSearchValue = () => {
  
  };
  
  const setViewType = (value: Pick<FriendsFilteringQuery, 'viewType'>) => {
    qc.setQueryData(
      FRIENDS_FILTERING_QUERY_KEY,
      (prev: FriendsFilteringQuery) => {
        return {
          ...prev, viewType: value,
        };
      },
    );
  };
  
  const setSortType = (value: Pick<FriendsFilteringQuery, 'sortType'>) => {
    qc.setQueryData(
      FRIENDS_FILTERING_QUERY_KEY,
      (prev: FriendsFilteringQuery) => {
        return {
          ...prev, sortType: value,
        };
      },
    );
  };
  
  const setValueMutation = useMutation({
    mutationFn: async({ value, type }: FriendsActionMutation) => {
      if (!type) return;
      if (!value && type === 'search') return;
      
      if (type === 'sort') {
        setSortType(value as Pick<FriendsFilteringQuery, "sortType">)
      }
      
      if (type === 'view') {
        setViewType(value as Pick<FriendsFilteringQuery, "viewType">)
      }
      
      if (type === 'search') {
      
      }
    },
    onSuccess: async() => await qc.invalidateQueries({ queryKey: FRIENDS_FILTERING_QUERY_KEY }),
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { setValueMutation };
};
