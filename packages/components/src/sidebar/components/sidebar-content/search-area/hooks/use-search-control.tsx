import { SEARCH_QUERY_KEY, searchQuery, SearchQuery, SearchType } from '../queries/search-query.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSearchUsers } from '../queries/get-search-users.ts';
import { getSearchTopics } from '../queries/get-search-topics.ts';

async function getSearchResults(
  value: string, type: SearchType,
) {
  if (!value) return null;
  
  switch (type) {
    case 'threads':
      const { data: threads, error: threadsErr, } = await getSearchTopics({
        searchedValue: value,
      });
      
      if (threadsErr) throw threadsErr;
      
      return threads;
    case 'users':
      const { data: users, error: usersErr } = await getSearchUsers(
        value,
      );
      
      if (usersErr) throw usersErr;
      
      return users;
  }
}

export const useSearchControl = () => {
  const { data: searchState } = searchQuery();
  const searchType = searchState.type;
  const qc = useQueryClient();
  
  const setSearchQueryMutation = useMutation({
      mutationFn: async(values: SearchQuery) => {
        qc.setQueryData(
          SEARCH_QUERY_KEY, (prev: SearchQuery) => { return { ...prev, ...values } },
        );
      },
      onSuccess: async() => {
        await qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY });
      },
      onError: (e) => { throw new Error(e.message) },
    },
  );
  
  const handleSearchMutation = useMutation({
    mutationFn: async(value: string) => {
      if (!searchType) return;
      
      return getSearchResults(value, searchType);
    },
    onSuccess: async(data) => {
      qc.setQueryData(SEARCH_QUERY_KEY, (prev: SearchQuery,) => {
        return { ...prev, results: data };
      });
      
      await qc.invalidateQueries({ queryKey: SEARCH_QUERY_KEY });
    },
    onError: (e) => { throw new Error(e.message) },
  });
  
  return { handleSearchMutation, setSearchQueryMutation };
};