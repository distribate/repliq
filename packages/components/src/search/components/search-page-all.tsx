import { searchPageQuery } from '#search/queries/search-page-query.ts';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import { SearchPageUser } from '#search/components/search-page-users.tsx';
import { SearchPageThread } from '#search/components/search-page-threads.tsx';

export const SearchPageAll = () => {
  const { data: searchState } = searchPageQuery()
  
  if (!searchState.results) return <ContentNotFound title="s"/>
  
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
  )
}