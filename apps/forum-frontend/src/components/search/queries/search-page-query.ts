import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { SearchThread, SearchUser } from "./get-search-results";
import { atom } from "@reatom/core";

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

export const searchPageAtom = atom<SearchPageQuery>(initial, "searchPage")