import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { SearchThread, SearchUser } from "./get-search-results";

export const SEARCH_PAGE_QUERY_KEY = createQueryKey("ui", [
  "search-page-state",
]);

export type SearchResultsAll = Array<SearchUser | SearchThread>;
export type SearchResult = SearchUser | SearchThread;

export type SearchPageQuery = {
  queryValue: string | null;
  results: Array<SearchThread | SearchUser> | null;
  limit: number;
  isLimited: boolean;
  type: "user" | "title";
};

const initial: SearchPageQuery = {
  queryValue: null,
  results: null,
  isLimited: false,
  limit: SEARCH_PAGE_LIMIT,
  type: "title",
};

export const searchPageQuery = () => useQuery<SearchPageQuery>({
  queryKey: SEARCH_PAGE_QUERY_KEY,
  initialData: initial,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
});