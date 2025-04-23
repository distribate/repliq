import { searchPageQuery } from "#components/search/queries/search-page-query.ts";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { filterSearchResults } from "#components/search/helpers/filter-search-results.ts";
import { SearchPageUser } from "./search-page-user";
import { SearchUser } from "../queries/get-search-results";

export const SearchPageUsers = () => {
  const { data: searchState } = searchPageQuery();

  if (!searchState.results) {
    return <ContentNotFound title="Ничего не найдено" />
  }

  const users = filterSearchResults<SearchUser>(searchState.results, "users");

  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      {users.map(({ name_color, nickname }) => (
        <SearchPageUser key={nickname} name_color={name_color} nickname={nickname} />)
      )}
    </div>
  );
};