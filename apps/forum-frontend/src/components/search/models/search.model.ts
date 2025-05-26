import {
  SearchPageQuery,
  searchPageResultsAtom,
  SearchResultsAll,
} from "#components/search/models/search-page.model";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { searchTypeParamAtom } from "./search-related.model";
import { forumSearchClient } from "@repo/shared/api/forum-client";

type GetSearchResults = {
  queryValue: string;
  limit: number;
} & (
  | { type: "threads"; threadsType: Pick<SearchPageQuery, "type">["type"] }
  | { type: "users" }
)

export type SearchUser = {
  nickname: string,
  name_color: string
}

export type SearchThread = {
  title: string
  id: string
}

async function getSearchThreads({
  queryValue, limit
}: Omit<GetSearchResults, "type">) {
  const res = await forumSearchClient.search["get-search"].$get({
    query: { type: "thread", queryValue, limit: `${limit}` }
  })
  const data = await res.json()

  if ("error" in data) return null

  return data.data as { id: string, title: string }[]
}

async function getSearchUsers({
  queryValue, limit
}: Omit<GetSearchResults, "type">) {
  const res = await forumSearchClient.search["get-search"].$get({
    query: { type: "user", queryValue, limit: `${limit}` }
  })
  const data = await res.json()

  if ("error" in data) return null

  return data.data as { nickname: string, name_color: string }[]
}

export async function getSearchResults({
  type, queryValue, limit
}: GetSearchResults & { limit: number }): Promise<SearchResultsAll | null> {
  switch (type) {
    case "threads":
      return getSearchThreads({ queryValue, limit });
    case "users":
      return queryValue ? getSearchUsers({ queryValue, limit }) : null;
    default:
      return null;
  }
}

export const handleSearchAction = reatomAsync(async (ctx, query: string) => {
  const type = ctx.get(searchTypeParamAtom)
  if (!type) return;

  return await ctx.schedule(() =>
    getSearchResults({ type, queryValue: query, limit: SEARCH_PAGE_LIMIT, threadsType: "user" })
  )
}, {
  name: "handleSearchAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    searchPageResultsAtom(ctx, res.length ? res : null)
  }
}).pipe(withStatusesAtom())