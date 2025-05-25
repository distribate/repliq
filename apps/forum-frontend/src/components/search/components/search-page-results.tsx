import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import {
  searchPageAtom,
} from "#components/search/queries/search-page-query.ts";
import { SearchPageUsers } from "#components/search/components/search-page-users.tsx";
import { SearchPageThreads } from "#components/search/components/search-page-threads.tsx";
import { SearchPageAll } from "#components/search/components/search-page-all.tsx";
import { handleSearchAction } from "#components/search/hooks/use-search-page.ts";
import { useInView } from "react-intersection-observer";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { reatomComponent, useUpdate } from "@reatom/npm-react";

type SearchPageResultsProps = {
  type: "users" | "threads" | "all";
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

const SyncInView = ({ inView }: { inView: boolean }) => {
  useUpdate((ctx) => {
    if (!inView) return;

    searchPageAtom(ctx, (state) => {
      if (state.isLimited) return state;

      return { ...state, limit: state.limit + SEARCH_PAGE_LIMIT }
    })
  }, [inView])

  return null;
}

export const SearchPageResults = reatomComponent<SearchPageResultsProps>(({ ctx, type }) => {
  const { inView, ref } = useInView({ threshold: 0 });

  if (ctx.spy(handleSearchAction.statusesAtom).isPending) return <SearchPageResultsSkeleton />;

  return (
    <>
      <SyncInView inView={inView} />
      <>
        {type === "users" && <SearchPageUsers />}
        {type === "threads" && <SearchPageThreads />}
        {type === "all" && <SearchPageAll />}
        <div ref={ref} className="h-[1px] w-full" />
      </>
    </>
  );
}, "SearchPageResults")