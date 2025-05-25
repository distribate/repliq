import { searchPageAtom } from "#components/search/queries/search-page-query.ts";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { SearchPageThread } from "#components/search/components/search-page-threads.tsx";
import { SearchPageUser } from "./search-page-user";
import { reatomComponent } from "@reatom/npm-react";

export const SearchPageAll = reatomComponent(({ ctx }) => {
  const searchState = ctx.spy(searchPageAtom)

  if (!searchState.results) {
    return <ContentNotFound title={`Ничего не нашли по запросу "${searchState.queryValue}"`} />;
  }

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
}, "SearchPageAll")