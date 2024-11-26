import {
  SEARCH_QUERY_KEY,
  searchQuery,
  SearchQuery,
} from '../queries/search-query.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSearchResults } from '#search/queries/get-search-results.ts';
import { SEARCH_SIDEBAR_LIMIT } from '@repo/shared/constants/limits.ts';

export const useSearchControl = () => {
  const qc = useQueryClient();
  const { data: searchState } = searchQuery();
  
  const setSearchQueryMutation = useMutation({
    mutationFn: async(values: Partial<SearchQuery>) => {
      return qc.setQueryData(
        SEARCH_QUERY_KEY,
        (prev: SearchQuery) => ({
          ...prev, ...values,
          queryValue: values.queryValue ? values.queryValue.length >= 1 ? values.queryValue : null : null,
        }),
      );
    },
    onSuccess: async(_, variables) => {
      if (!variables.queryValue) {
        return qc.setQueryData(SEARCH_QUERY_KEY, (prev: SearchQuery) => ({
          ...prev, results: null,
        }));
      }
      
      handleSearchMutation.mutate(variables.queryValue);
    },
    onError: e => { throw new Error(e.message); },
  });
  
  const handleSearchMutation = useMutation({
    mutationFn: async(queryValue: string) => {
      if (!searchState.type) return;
      return getSearchResults({
        value: queryValue,
        type: searchState.type,
        limit: SEARCH_SIDEBAR_LIMIT,
      });
    },
    onSuccess: async(data) => {
      return qc.setQueryData(SEARCH_QUERY_KEY, (prev: SearchQuery) => ({
        ...prev, results: data?.length ? data : null,
      }));
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { handleSearchMutation, setSearchQueryMutation };
};