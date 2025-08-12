import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import {
  searchPageAtom,
  SearchPageType,
  searchPageTypeAtom,
} from "#components/search/models/search-page.model";
import { handleSearchAction, SearchThread, SearchUser } from "#components/search/models/search.model";
import { useInView } from "react-intersection-observer";
import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { searchPageResultsAtom } from "#components/search/models/search-page.model";
import { SearchPageThread, SearchPageUser } from "./search-page-childs";
import { SearchResult, SearchResultsAll } from "../models/search-page.model";
import { atom } from "@reatom/core";
import { ReactNode } from "react";

function filterSearchResults<T extends SearchResult>(
  results: SearchResultsAll, type: "threads" | "users",
): T[] {
  return results.filter((item): item is T => {
    if (type === "threads") return "id" in item && "title" in item;
    if (type === "users") return "nickname" in item;

    return false;
  });
}

const resultsIsEmptyAtom = atom((ctx) => {
  const target = ctx.spy(searchPageResultsAtom)

  return !(target && target.length >= 1)
}, "resultsIsEmptyAtom")

const SearchPageUsers = reatomComponent(({ ctx }) => {
  const results = ctx.spy(searchPageResultsAtom)

  if (!results) {
    return <ContentNotFound title="Ничего не найдено" />
  }

  const users = filterSearchResults<SearchUser>(results, "users");

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {users.map((user) => (
        <SearchPageUser key={user.nickname} {...user} />)
      )}
    </div>
  );
}, "SearchPageUsers")

const SearchPageThreads = reatomComponent(({ ctx }) => {
  const results = ctx.spy(searchPageResultsAtom)

  if (!results) {
    return <ContentNotFound title="Ничего не найдено" />
  }

  const threads = filterSearchResults<SearchThread>(results, "threads");

  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      {threads.map((thread) => (
        <SearchPageThread key={thread.id} {...thread} />
      ))}
    </div>
  );
}, "SearchPageThreads")

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

    searchPageAtom(ctx, 
      (state) => ({ ...state, limit: state.limit + SEARCH_PAGE_LIMIT })
    )
  }, [inView])

  return null;
}

const InViewer = () => {
  const { inView, ref } = useInView({ threshold: 0 });

  return (
    <>
      <SyncInView inView={inView} />
      <div ref={ref} className="h-[1px] w-full" />
    </>
  )
}

const COMPONENTS: Record<SearchPageType, ReactNode> = {
  "users": <SearchPageUsers />,
  "threads": <SearchPageThreads />,
  "all": (
    <>
      <SearchPageUsers />
      <SearchPageThreads />
    </>
  )
} as const;

export const SearchPageResults = reatomComponent(({ ctx }) => {
  if (ctx.spy(handleSearchAction.statusesAtom).isPending) {
    return <SearchPageResultsSkeleton />;
  }

  const isEmpty = ctx.spy(resultsIsEmptyAtom)

  if (isEmpty) {
    return <ContentNotFound title="Ничего не найдено" />
  }

  return (
    <>
      {COMPONENTS[ctx.spy(searchPageTypeAtom)]}
      <InViewer />
    </>
  );
}, "SearchPageResults")