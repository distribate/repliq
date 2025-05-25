import { ContentNotFound } from "#components/templates/components/content-not-found";
import { searchPageAtom } from "#components/search/queries/search-page-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Link } from "@tanstack/react-router";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { filterSearchResults } from "#components/search/helpers/filter-search-results.ts";
import { Text } from "lucide-react";
import { SearchThread } from "../queries/get-search-results";
import { reatomComponent } from "@reatom/npm-react";

export const SearchPageThread = ({ title, id }: SearchThread) => {
  return (
    <Link
      to={THREAD_URL + id}
      className="flex p-4 items-center gap-3 hover:bg-shark-700 truncate w-full rounded-md"
    >
      <Text size={40} className="text-shark-300" />
      <Typography className="text-[18px] font-semibold text-shark-50">
        {title}
      </Typography>
    </Link>
  );
};

export const SearchPageThreads = reatomComponent(({ ctx }) => {
  const searchState = ctx.spy(searchPageAtom)

  if (!searchState.results)
    return <ContentNotFound title="Ничего не найдено" />;

  const threads = filterSearchResults<SearchThread>(
    searchState.results,
    "threads",
  );

  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      {threads.map((thread) => (
        <SearchPageThread key={thread.id} {...thread} />
      ))}
    </div>
  );
}, "SearchPageThreads")