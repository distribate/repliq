import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import {
  ThreadEntity,
  UserEntity,
} from "@repo/types/entities/entities-type.ts";

export const SEARCH_QUERY_KEY = createQueryKey("ui", ["search-state"]);

export type SearchUser = Pick<UserEntity, "name_color" | "nickname">;
export type SearchThread = Pick<ThreadEntity, "id" | "title">;

export type SearchType = "users" | "threads" | "all";

export type SearchResults = SearchUser[] | SearchThread[];

export type SearchQuery = {
  type: Exclude<SearchType, "all">;
  results: SearchResults | null;
  queryValue: string | null;
};

const initial: SearchQuery = {
  type: "users",
  queryValue: null,
  results: null,
};

export const searchQuery = () =>
  useQuery<SearchQuery, Error>({
    queryKey: SEARCH_QUERY_KEY,
    initialData: initial,
    refetchOnWindowFocus: false,
    staleTime: 1000,
    placeholderData: keepPreviousData,
  });
