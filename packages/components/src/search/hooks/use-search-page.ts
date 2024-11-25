import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SEARCH_PAGE_QUERY_KEY, SearchPageQuery } from '#search/queries/search-page-query.ts';
import { SearchType } from '#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts';
import { getSearchResults } from '#search/queries/get-search-results.ts';
import { SEARCH_PAGE_LIMIT } from '@repo/shared/constants/limits.ts';
import { useSearchParams } from 'next/navigation';

export const SEARCH_PAGE_RESULTS_MUTATION_KEY = [ 'search-page-results' ];

type HandleSearchMutation = {
  queryValue: string | null,
  limit: number
}

export const useSearchPage = (searchType: SearchType) => {
  const qc = useQueryClient();
  const userByParam = useSearchParams().get('user') as string || null;
  
  const setValueMutation = useMutation({
    mutationFn: async(values: Partial<SearchPageQuery>) => {
      return qc.setQueryData(SEARCH_PAGE_QUERY_KEY, (prev: SearchPageQuery) => ({
        ...prev, ...values,
        queryValue: values.queryValue ? values.queryValue.length >= 1 ? values.queryValue : null : null,
      }));
    },
    onSuccess: async(_, variables) => {
      if (!variables.queryValue && searchType !== 'threads') {
        qc.setQueryData(SEARCH_PAGE_QUERY_KEY, (prev: SearchPageQuery) => ({
          ...prev, results: null,
        }));
        return;
      }
      
      const limit = variables.limit ?? 10;
      
      handleSearchMutation.mutate({
        limit, queryValue: variables.queryValue ?? null,
      });
    },
    onError: e => { throw new Error(e.message);},
  });
  
  const handleSearchMutation = useMutation({
    mutationKey: SEARCH_PAGE_RESULTS_MUTATION_KEY,
    mutationFn: async({ limit, queryValue }: HandleSearchMutation) =>
      getSearchResults({
        type: searchType, value: queryValue, limit, user: userByParam
      }),
    onSuccess: async(data) => {
      if (!data) return;
      
      return qc.setQueryData(SEARCH_PAGE_QUERY_KEY, (prev: SearchPageQuery) => ({
        ...prev,
        isLimited: data?.length < SEARCH_PAGE_LIMIT,
        results: data?.length ? data : null,
      }));
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { setValueMutation };
};