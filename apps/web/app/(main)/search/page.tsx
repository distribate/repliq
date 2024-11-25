import { SearchNavigationBadge } from '@repo/components/src/search/components/search-navigation-badge.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { SearchPageResults } from '@repo/components/src/search/components/search-page-results.tsx';
import dynamic from 'next/dynamic';
import {
  SearchType
} from '@repo/components/src/sidebar/desktop/components/sidebar-content/search/queries/search-query.ts';

const SearchPageInput = dynamic(
  () =>
    import('@repo/components/src/search/components/search-page-input')
    .then(m => m.SearchPageInput),
  {
    loading: () => <Skeleton className="h-full w-full" />,
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
      <div className="flex items-center py-4 px-2 h-[80px] bg-shark-950 w-full rounded-lg">
        <SearchPageInput />
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