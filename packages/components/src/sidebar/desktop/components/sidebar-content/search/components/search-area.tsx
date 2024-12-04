import {
  searchQuery,
  SearchThread,
  SearchUser,
} from "../queries/search-query.ts";
import { SearchAreaNotFound } from "#templates/search-area-not-found.tsx";
import { SearchUserItem } from "#cards/components/search/search-user-card.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import Link from "next/link";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { ThreadEntity } from "@repo/types/entities/entities-type.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { SEARCH_SIDEBAR_LIMIT } from "@repo/shared/constants/limits.ts";

type SearchCardTopicProps = Pick<ThreadEntity, "id" | "title">;

const SearchCardTopic = ({ title, id }: SearchCardTopicProps) => {
  return (
    <Link
      href={THREAD_URL + id}
      className="flex items-center gap-2 p-2 bg-shark-900 rounded-md"
    >
      {title}
    </Link>
  );
};

const SearchItemSkeleton = () => {
  return (
    <div className="flex items-center px-2 py-2 gap-2">
      <Skeleton className="rounded-none w-4 h-4" />
      <div className="flex items-center gap-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16 " />
      </div>
    </div>
  );
};

const SearchAreaSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full max-h-[400px] overflow-y-scroll">
      <SearchItemSkeleton />
      <SearchItemSkeleton />
      <SearchItemSkeleton />
    </div>
  );
};

export const SearchArea = () => {
  const { data: searchState, isLoading } = searchQuery();
  const { type, queryValue, results } = searchState;

  if (isLoading) return <SearchAreaSkeleton />;

  const typeIsUsers = type === "users";
  const typeIsTopics = type === "threads";

  if (!queryValue) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-h-[400px] overflow-y-scroll">
      {!results ? (
        <SearchAreaNotFound searchValue={queryValue || null} />
      ) : (
        <>
          {typeIsUsers &&
            (searchState.results as SearchUser[]).map(
              ({ nickname, name_color }) => (
                <SearchUserItem
                  key={nickname}
                  nicknameColor={name_color}
                  nickname={nickname}
                />
              ),
            )}
          {typeIsTopics &&
            (results as SearchThread[]).map(({ title, id }) => (
              <SearchCardTopic key={id} id={id} title={title} />
            ))}
          {results.length >= SEARCH_SIDEBAR_LIMIT && (
            <Link
              href={{
                pathname: "/search",
                query: { type, queryValue },
              }}
            >
              <Typography textColor="gray" textSize="small">
                показать больше
              </Typography>
            </Link>
          )}
        </>
      )}
    </div>
  );
};
