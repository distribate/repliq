import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SEARCH_PAGE_QUERY_KEY,
  searchPageQuery,
  SearchPageQuery,
} from "#components/search/queries/search-page-query.ts";
import { getSearchResults, SearchUser } from "#components/search/queries/get-search-results.ts";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { useSearch } from "@tanstack/react-router"
import { useEffect } from "react";

export const SEARCH_PAGE_RESULTS_MUTATION_KEY = ["search-page-results"];

type HandleSearchMutation = {
  queryValue: string;
  limit: number;
  threadsType: Pick<SearchPageQuery, "type">["type"];
};

export const useSearchPage = () => {
  const qc = useQueryClient();
  const params = useSearch({
    from: "/_protected/search",
    select: (params) => {
      return {
        type: params.type,
        user: params.user as SearchUser
      }
    }
  });

  const searchType = params.type ?? "all";
  const threadsSearchType = params.user ?? null;
  const { data: searchState } = searchPageQuery();

  useEffect(() => {
    if (threadsSearchType) {
      setValueMutation.mutate({
        type: threadsSearchType ? "user" : "title",
        queryValue: threadsSearchType,
      })
    }
  }, [threadsSearchType]);

  const setValueMutation = useMutation({
    mutationFn: async (values: Partial<SearchPageQuery>) => {
      return qc.setQueryData(
        SEARCH_PAGE_QUERY_KEY,
        (prev: SearchPageQuery) => ({
          ...prev,
          ...values,
          queryValue: values.queryValue
            ? values.queryValue.length >= 1
              ? values.queryValue
              : null
            : null,
        }),
      );
    },
    onSuccess: async (_, variables) => {
      if (!variables.queryValue) {
        return qc.setQueryData(
          SEARCH_PAGE_QUERY_KEY,
          (prev: SearchPageQuery) => ({
            ...prev, results: null
          }),
        );
      }

      const limit = variables.limit ?? SEARCH_PAGE_LIMIT;

      handleSearchMutation.mutate({
        queryValue: variables.queryValue,
        limit,
        threadsType: searchState.type,
      });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const handleSearchMutation = useMutation({
    mutationKey: SEARCH_PAGE_RESULTS_MUTATION_KEY,
    mutationFn: async ({ queryValue, limit, threadsType }: HandleSearchMutation) => 
      getSearchResults({ type: searchType, queryValue, limit: 16, threadsType }),
    onSuccess: async (data) => {
      if (!data) return;

      return qc.setQueryData(
        SEARCH_PAGE_QUERY_KEY,
        (prev: SearchPageQuery) => ({
          ...prev,
          isLimited: data?.length < SEARCH_PAGE_LIMIT,
          results: data?.length ? data : null,
        }),
      );
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { setValueMutation };
};