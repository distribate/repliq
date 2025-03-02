import { searchPageQuery } from "#components/search/queries/search-page-query.ts";
import { ContentNotFound } from "#components/templates/content-not-found.tsx";
import { SearchPageThread } from "#components/search/components/search-page-threads.tsx";
import { SearchPageUser } from "./search-page-user";

export const SearchPageAll = () => {
  const { data: searchState } = searchPageQuery();

  if (!searchState.results) return <ContentNotFound title={`Ничего не нашли по запросу "${searchState.queryValue}"`} />;

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="flex flex-col gap-y-2 w-full">
        {searchState.results.map((item, i) => {
          if ("nickname" in item) {
            return <SearchPageUser key={i} {...item} />;
          }
          if ("id" in item && "title" in item) {
            return <SearchPageThread key={i} {...item} />;
          }
          return null;
        })}
      </div>
    </div>
  );
};