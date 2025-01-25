import { SearchType } from "#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";
import {
  SearchPageQuery,
  SearchResultsAll,
} from "#search/queries/search-page-query.ts";
import { shuffleArray } from "#search/helpers/shuffler.ts";
import { RequestDetails } from "@repo/types/entities/entities-type.ts";
import { forumSearchClient } from "@repo/shared/api/forum-client";

type GetSearchResults = RequestDetails & {
  value: string;
  type: SearchType;
  threadsType?: Pick<SearchPageQuery, "type">["type"];
};

async function getSearchThreads({
  value, limit, type,
}: GetSearchResults) {
  const res = await forumSearchClient.search["get-search"].$get({
    query: {
      type: "thread",
      queryValue: value,
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data as { id: string, title: string }[]
}

async function getSearchUsers({
  value, limit,
}: GetSearchResults) {
  const res = await forumSearchClient.search["get-search"].$get({
    query: {
      type: "user",
      queryValue: value,
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data as { nickname: string, name_color: string }[]
}

export async function getSearchResults({
  type,
  value,
  limit,
  threadsType,
}: GetSearchResults): Promise<SearchResultsAll | null> {
  const searchThreads = () => getSearchThreads({ value, limit, type });
  const searchUsers = () => getSearchUsers({ value, limit, type });

  switch (type) {
    case "threads":
      return searchThreads();
    case "users":
      return value ? searchUsers() : null;
    case "all": {
      const [threads, users] = await Promise.all([
        searchThreads(), searchUsers()
      ]);

      return shuffleArray([...threads ?? [], ...users ?? []]);
    }

    default:
      return null;
  }
}