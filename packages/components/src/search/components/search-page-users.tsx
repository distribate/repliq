import { searchPageQuery } from "#search/queries/search-page-query.ts";
import { ContentNotFound } from "#templates/content-not-found.tsx";
import { SearchUser } from "#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";
import { filterSearchResults } from "#search/helpers/filter-search-results.ts";
import { SearchPageUser } from "./search-page-user";

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