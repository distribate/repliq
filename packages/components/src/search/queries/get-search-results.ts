import {
  SearchPageQuery,
  SearchResultsAll,
} from "#search/queries/search-page-query.ts";
import { shuffleArray } from "@repo/lib/helpers/shuffle-array.ts";
import { RequestDetails } from "@repo/types/entities/entities-type.ts";
import { forumSearchClient } from "@repo/shared/api/forum-client";

type GetSearchResults = Pick<RequestDetails, "limit"> & {
  queryValue: string;
} & (
  | { type: "threads"; threadsType: Pick<SearchPageQuery, "type">["type"] }
  | { type: "users" }
  | { type: "all" }
)

async function getSearchThreads({
  queryValue, limit
}: Omit<GetSearchResults, "type">) {
  const res = await forumSearchClient.search["get-search"].$get({
    query: {  type: "thread", queryValue }
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
    query: { type: "user", queryValue }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data as { nickname: string, name_color: string }[]
}

export async function getSearchResults({
  type, queryValue, limit
}: GetSearchResults): Promise<SearchResultsAll | null> {
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