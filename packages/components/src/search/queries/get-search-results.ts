import { SearchType } from "#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";
import {
  SearchPageQuery,
  SearchResultsAll,
} from "#search/queries/search-page-query.ts";
import { getSearchThreads } from "#sidebar/desktop/components/sidebar-content/search/queries/get-search-topics.ts";
import { getSearchUsers } from "#sidebar/desktop/components/sidebar-content/search/queries/get-search-users.ts";
import { shuffleArray } from "#search/helpers/shuffler.ts";
import { RequestDetails } from "@repo/types/entities/entities-type.ts";

type GetSearchResults = RequestDetails & {
  value: string;
  type: SearchType;
  threadsType?: Pick<SearchPageQuery, "type">["type"];
};

export async function getSearchResults({
  type,
  value,
  limit,
  threadsType,
}: GetSearchResults): Promise<SearchResultsAll | null> {
  const searchThreads = () =>
    getSearchThreads({
      searchedValue: value,
      limit,
      type: threadsType ?? "title",
    });
  const searchUsers = () =>
    getSearchUsers({
      searchedValue: value,
      limit,
    });

  switch (type) {
    case "threads":
      return searchThreads();

    case "users":
      return value ? searchUsers() : null;

    case "all": {
      const [threads, users] = await Promise.all([
        searchThreads(),
        searchUsers(),
      ]);

      return shuffleArray([...threads, ...users]);
    }

    default:
      return null;
  }
}
