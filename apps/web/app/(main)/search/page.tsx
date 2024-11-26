import { SearchNavigationBadge } from '@repo/components/src/search/components/search-navigation-badge.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { SearchPageResults } from '@repo/components/src/search/components/search-page-results.tsx';
import { SearchType } from '@repo/components/src/sidebar/desktop/components/sidebar-content/search/queries/search-query.ts';
import { SearchPageFilter } from '@repo/components/src/search/components/search-page-filter.tsx';
import dynamic from 'next/dynamic';

const SearchPageInput = dynamic(
  () =>
    import('@repo/components/src/search/components/search-page-input')
    .then(m => m.SearchPageInput),
  {
    loading: () => <Skeleton className="h-[80px] w-full" />,
  },
);

type SearchPageProps = {
  searchParams: {
    type: SearchType
  }
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { type } = searchParams;
  const searchType = type ?? "all"
  
  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="flex justify-between items-center bg-shark-950 px-6 gap-2 py-4 h-[80px] w-full rounded-lg">
        <SearchPageInput />
        <div className="w-[40px]">
          <SearchPageFilter type={searchType}/>
        </div>
      </div>
      <div className="flex items-center gap-2 w-fit">
        <SearchNavigationBadge title="Все" paramValue="all" />
        <SearchNavigationBadge title="Игроки" paramValue="users" />
        <SearchNavigationBadge title="Треды" paramValue="threads" />
      </div>
      <div className="mt-4 w-full h-full">
        <SearchPageResults type={searchType}/>
      </div>
    </div>
  );
}