import {
  searchPageAtom,
  SearchPageQuery,
} from "#components/search/queries/search-page-query.ts";
import { getSearchResults, SearchUser } from "#components/search/queries/get-search-results.ts";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { getRouteApi } from "@tanstack/react-router"
import { useUpdate } from "@reatom/npm-react";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";

type HandleSearchMutation = {
  queryValue: string;
  limit: number;
  threadsType: Pick<SearchPageQuery, "type">["type"];
  type: "threads" | "users" | "all"
};

const searchRoute = getRouteApi("/_protected/search")

export const searchParamsAtom = atom<{ type: "threads" | "users" | "all", user: SearchUser | null }>({ type: "all", user: null }, "searchTypeParam")

export const handleSearchAction = reatomAsync(async (ctx, { queryValue, limit, threadsType, type }: HandleSearchMutation) => {
  return await ctx.schedule(() => getSearchResults({ type, queryValue, limit: limit ?? 16, threadsType }))
}, {
  name: "handleSearchAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    searchPageAtom(ctx, (state) => ({
      ...state,
      isLimited: res?.length < SEARCH_PAGE_LIMIT,
      results: res?.length ? res : null,
    }))
  }
}).pipe(withStatusesAtom())

export const searchValueAction = reatomAsync(async (ctx, values: Partial<SearchPageQuery>) => {
  return searchPageAtom(ctx, (state) => ({
    ...state, ...values,
    queryValue: values.queryValue
      ? values.queryValue.length >= 1
        ? values.queryValue
        : null
      : null,
  }))
}, {
  name: "searchValueAction",
  onEffect: (ctx, [variables]) => {
    if (!variables.queryValue) {
      searchPageAtom(ctx, (state) => ({ ...state, results: null }))
    }

    const limit = variables.limit ?? SEARCH_PAGE_LIMIT;

    handleSearchAction(ctx, {
      type: ctx.get(searchParamsAtom).type,
      queryValue: variables.queryValue,
      limit,
      threadsType: ctx.get(searchPageAtom).type,
    });
  }
})

export const SyncParams = () => {
  const { type, user } = searchRoute.useSearch({ select: (params) => ({ type: params.type ?? "all", user: params.user as SearchUser }) });

  useUpdate((ctx) => searchParamsAtom(ctx, { type, user }), [type, user])
  return null;
}