import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import {
  SEARCH_PAGE_QUERY_KEY,
  SearchPageQuery,
  searchPageQuery,
} from "#search/queries/search-page-query.ts";
import { SearchPageUsers } from "#search/components/search-page-users.tsx";
import { SearchPageThreads } from "#search/components/search-page-threads.tsx";
import { SearchType } from "#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";
import { SearchPageRelated } from "#search/components/search-page-related.tsx";
import { SearchPageAll } from "#search/components/search-page-all.tsx";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { SEARCH_PAGE_RESULTS_MUTATION_KEY } from "#search/hooks/use-search-page.ts";
import { useInView } from "react-intersection-observer";
import { Suspense, useEffect } from "react";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { Typography } from "@repo/ui/src/components/typography";

type SearchPageResultsProps = {
  type: SearchType;
};

const SearchPageResultsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      <div className="flex items-center p-4 gap-3 w-full">
        <Skeleton className="w-[40px] h-[40px]" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="flex items-center p-4 gap-3 w-full">
        <Skeleton className="w-[40px] h-[40px]" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="flex items-center p-4 gap-3 w-full">
        <Skeleton className="w-[40px] h-[40px]" />
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
};

export const SearchPageResults = ({ type }: SearchPageResultsProps) => {
  const { data: searchState } = searchPageQuery();
  const qc = useQueryClient();

  const { inView, ref } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && !searchState.isLimited) {
      qc.setQueryData(SEARCH_PAGE_QUERY_KEY, (prev: SearchPageQuery) => ({
        ...prev,
        limit: searchState.limit + SEARCH_PAGE_LIMIT,
      }));
    }
  }, [inView]);

  const mutData = useMutationState({
    filters: { mutationKey: SEARCH_PAGE_RESULTS_MUTATION_KEY },
    select: (m) => m.state.status,
  });

  const isLoading = mutData[mutData.length - 1] === "pending";

  if (isLoading) return <SearchPageResultsSkeleton />;

  return (
    <Suspense fallback={<SearchPageResultsSkeleton />}>
      {type === "users" && <SearchPageUsers />}
      {type === "threads" && <SearchPageThreads />}
      {type === "all" && <SearchPageAll />}
      <div ref={ref} className="h-[1px] w-full" />
    </Suspense>
  );
};