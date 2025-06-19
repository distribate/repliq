import {
  SearchPageQuery,
  searchPageResultsAtom,
  searchPageTypeAtom,
  SearchResultsAll,
} from "#components/search/models/search-page.model";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { forumSearchClient } from "@repo/shared/api/forum-client";

type GetSearchResults = {
  query: string;
  limit: number;
} & (
  | { type: "threads"; threadsType: Pick<SearchPageQuery, "type">["type"] }
  | { type: "users" }
  | { type: "all" }
)

export type SearchUser = {
  nickname: string,
  name_color: string
  avatar: string | null
}

export type SearchThread = {
  title: string
  id: string
}

async function getSearchThreads({
  query, limit
}: Omit<GetSearchResults, "type">) {
  const res = await forumSearchClient.search["get-search"].$get({
    query: { type: "thread", queryValue: query, limit: `${limit}` }
  })
  const data = await res.json()

  if ("error" in data) return null

  return data.data as SearchThread[]
}

async function getSearchUsers({
  query, limit
}: Omit<GetSearchResults, "type">) {
  const res = await forumSearchClient.search["get-search"].$get({
    query: { type: "user", queryValue: query, limit: `${limit}` }
  })
  const data = await res.json()

  if ("error" in data) return null

  return data.data as SearchUser[]
}

export async function getSearchResults({
  type, query, limit
}: GetSearchResults & { limit: number }): Promise<SearchResultsAll | null> {
  switch (type) {
    case "all":
      const [threads, users] = await Promise.all([
        getSearchThreads({ query, limit }),
        getSearchUsers({ query, limit })
      ]) 

      const data = [...threads ?? [], ...users ?? []]
      
      return data;
    case "threads":
      return getSearchThreads({ query, limit });
    case "users":
      return getSearchUsers({ query, limit })
    default:
      return null;
  }
}

export const handleSearchAction = reatomAsync(async (ctx, query: string) => {
  const type = ctx.get(searchPageTypeAtom)

  return await ctx.schedule(() =>
    getSearchResults({ type, query, limit: SEARCH_PAGE_LIMIT, threadsType: "user" })
  )
}, {
  name: "handleSearchAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    searchPageResultsAtom(ctx, res.length > 0 ? res : null)
  }
}).pipe(withStatusesAtom())