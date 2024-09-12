import { SearchItemSkeleton } from './search-item-skeleton.tsx';

export const SearchResultsSkeleton = () => {
  return (
    Array.from({ length: 3 }).map((_, i) => <SearchItemSkeleton key={i} />)
  );
};