import { SEARCH_QUERY_KEY, searchQuery, SearchQuery, SearchType } from '../queries/search-query.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSearchUsers } from '../queries/get-search-users.ts';
import { getSearchTopics } from '../queries/get-search-topics.ts';

export const SEARCHED_LIMIT = 5;

async function getSearchResults(
  value: string, type: SearchType,
) {
  if (!value || !type) return null;
  
  if (type === 'users') return getSearchUsers({ searchedValue: value, limit: SEARCHED_LIMIT });
  if (type === 'threads') return getSearchTopics({ searchedValue: value, limit: SEARCHED_LIMIT });
}

export const useSearchControl = () => {
  const qc = useQueryClient();
  const { data: searchState } = searchQuery();
  const searchType = searchState.type;
  
  const setSearchQueryMutation = useMutation({
    mutationFn: async(values: SearchQuery) => {
      return qc.setQueryData(
        SEARCH_QUERY_KEY, (prev: SearchQuery) => {
          return { ...prev, ...values };
        },
      );
    },
    onSuccess: async() => {
      await qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY });
    },
    onError: (e) => { throw new Error(e.message); },
  });
  
  const handleSearchMutation = useMutation({
    mutationFn: async(value: string) => {
      if (!searchType) return;
      
      return getSearchResults(value, searchType);
    },
    onSuccess: async(data) => {
      qc.setQueryData(SEARCH_QUERY_KEY, (prev: SearchQuery) => {
        return { ...prev, results: data };
      });
      
      await qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY });
    },
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { handleSearchMutation, setSearchQueryMutation };
};