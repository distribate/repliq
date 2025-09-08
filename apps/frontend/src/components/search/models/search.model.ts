import {
  SearchPageQuery,
  searchPageResultsAtom,
  searchPageTypeAtom,
  SearchResultsAll,
} from "#components/search/models/search-page.model";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { searchClient } from "#shared/forum-client";

type GetSearchResults = {
  limit: number;
} & (
    | { type: "threads"; threadsType: Pick<SearchPageQuery, "type">["type"] }
    | { type: "users" }
    | { type: "all" }
  )

export type SearchUser = {
  nickname: string,
  name_color: string
  avatar: string | null,
  description: string | null
}

export type SearchThread = {
  title: string
  id: string
}

async function getSearchThreads(
  searchQuery: string,
  { limit }: Omit<GetSearchResults, "type">
) {
  const res = await searchClient.search.$get({
    query: { type: "thread", query: searchQuery, limit: `${limit}` }
  })

  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data.data as SearchThread[]
}

async function getSearchUsers(
  searchQuery: string,
  { limit }: Omit<GetSearchResults, "type">
) {
  const res = await searchClient.search.$get({
    query: { type: "user", query: searchQuery, limit: `${limit}` }
  })

  const data = await res.json()

  if ("error" in data) return null

  return data.data as SearchUser[]
}

export async function getSearchResults(
  searchQuery: string,
  { type, limit }: GetSearchResults & { limit: number }
): Promise<SearchResultsAll | null> {
  switch (type) {
    case "all":
      const [threads, users] = await Promise.all([
        getSearchThreads(searchQuery, { limit }),
        getSearchUsers(searchQuery, { limit })
      ])

      const data = [...threads ?? [], ...users ?? []]

      return data;
    case "threads":
      return getSearchThreads(searchQuery, { limit });
    case "users":
      return getSearchUsers(searchQuery, { limit })
    default:
      return null;
  }
}

export const handleSearchAction = reatomAsync(async (ctx, searchQuery: string) => {
  const type = ctx.get(searchPageTypeAtom)

  return await ctx.schedule(() =>
    getSearchResults(searchQuery, { type, limit: SEARCH_PAGE_LIMIT, threadsType: "user" })
  )
}, {
  name: "handleSearchAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    searchPageResultsAtom(ctx, res.length > 0 ? res : null)
  }
}).pipe(withStatusesAtom())