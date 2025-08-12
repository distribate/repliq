import { searchPageQueryAtom, searchPageResultsAtom } from "#components/search/models/search-page.model";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { SearchPageThread, SearchPageUser } from "./search-page-childs";
import { reatomComponent } from "@reatom/npm-react";

export const SearchPageAll = reatomComponent(({ ctx }) => {
  const results = ctx.spy(searchPageResultsAtom)

  if (!results) {
    return <ContentNotFound title={`Ничего не нашли по запросу "${ctx.spy(searchPageQueryAtom)}"`} />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        {results.map((item, i) => {
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