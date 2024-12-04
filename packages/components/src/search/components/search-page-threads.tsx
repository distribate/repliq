"use client";

import { ContentNotFound } from "#templates/content-not-found.tsx";
import { searchPageQuery } from "#search/queries/search-page-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { SearchThread } from "#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";
import Link from "next/link";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { filterSearchResults } from "#search/helpers/filter-search-results.ts";

export const SearchPageThread = ({ title, id }: SearchThread) => {
  return (
    <Link
      href={THREAD_URL + id}
      className="flex p-4 items-center gap-3 hover:bg-shark-700 w-full rounded-md"
    >
      <Typography className="text-[18px]">{title}</Typography>
    </Link>
  );
};

export const SearchPageThreads = () => {
  const { data: searchState } = searchPageQuery();

  if (!searchState.results)
    return <ContentNotFound title="Ничего не найдено" />;

  const threads = filterSearchResults<SearchThread>(
    searchState.results,
    "threads",
  );

  return (
    <div className="flex flex-col gap-y-4 w-full h-fit">
      <Typography variant="pageTitle" className="text-[24px]">
        Треды
      </Typography>
      <div className="flex flex-col gap-y-2 w-full h-full">
        {threads.map((thread) => (
          <SearchPageThread key={thread.id} {...thread} />
        ))}
      </div>
    </div>
  );
};
