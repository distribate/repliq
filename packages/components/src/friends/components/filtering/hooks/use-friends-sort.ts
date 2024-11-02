import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FRIENDS_FILTERING_QUERY_KEY, FriendsFilteringQuery } from '../queries/friends-filtering-query.ts';

type FriendsActionType = 'view' | 'sort' | 'search' | 'list';
type FriendsActionMutation = {
  type: FriendsActionType;
  value: string | Partial<FriendsFilteringQuery>;
};

export const useFriendSort = () => {
  const qc = useQueryClient();
  
  const updateQueryData = (type: FriendsActionType, value: Partial<FriendsFilteringQuery>) => {
    qc.setQueryData(FRIENDS_FILTERING_QUERY_KEY, (prev: FriendsFilteringQuery) => ({
      ...prev,
      [type + 'Type']: value,
    }));
  };
  
  const setValueMutation = useMutation({
    mutationFn: async ({ value, type }: FriendsActionMutation) => {
      if (type && value && type !== 'search') {
        updateQueryData(type, value as Partial<FriendsFilteringQuery>);
      }
      
      
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: FRIENDS_FILTERING_QUERY_KEY }),
    onError: e => {throw new Error(e.message) },
  });
  
  return { setValueMutation };
};