import { shuffleArray } from "@repo/lib/helpers/shuffle-array.ts";
import { forumSearchClient } from "@repo/shared/api/forum-client";
import { SearchPageQuery, SearchResultsAll } from "./search-page-query";

type GetSearchResults = {
  queryValue: string;
  limit: number;
} & (
  | { type: "threads"; threadsType: Pick<SearchPageQuery, "type">["type"] }
  | { type: "users" }
  | { type: "all" }
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

  if ("error" in data) {
    return null
  }

  return data.data as { id: string, title: string }[]
}

async function getSearchUsers({
  queryValue, limit
}: Omit<GetSearchResults, "type">) {
  const res = await forumSearchClient.search["get-search"].$get({
    query: { type: "user", queryValue, limit: `${limit}` }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

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
    case "all": {
      const [threads, users] = await Promise.all([
        getSearchThreads({ queryValue, limit }), 
        getSearchUsers({ queryValue, limit })
      ]);

      return shuffleArray([...threads ?? [], ...users ?? []]);
    }

    default:
      return null;
  }
}