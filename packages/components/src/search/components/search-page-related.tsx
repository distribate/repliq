import { Typography } from "@repo/ui/src/components/typography.tsx";
import { FriendsSearchingCard } from "#friends/components/searching/friends-searching-card.tsx";
import { relatedQuery } from "#search/queries/related-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import Link from "next/link";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";

const SearchPageRelatedSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-8 w-full h-full">
      <div className="flex flex-col gap-y-4 w-full h-full">
        <Skeleton className="w-64 h-8" />
        <div className="grid grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-full h-full">
        <Skeleton className="w-64 h-8" />
        <div className="grid grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
        </div>
      </div>
    </div>
  );
};

export const SearchPageRelated = () => {
  const { data: relatedState, isLoading } = relatedQuery();

  if (isLoading) return <SearchPageRelatedSkeleton />;

  if (!relatedState) return null;

  return (
    <div className="flex flex-col gap-y-8 w-full h-full">
      {relatedState.lastUsers && (
        <div className="flex flex-col gap-y-4 w-full h-full">
          <Typography className="text-[24px]">
            Последние зарегистрированные игроки
          </Typography>
          <div className="grid grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
            {relatedState.lastUsers.map((user) => (
              <FriendsSearchingCard key={user.nickname} description={user.description} name_color={user.name_color} nickname={user.nickname} />
            ))}
          </div>
        </div>
      )}
      {relatedState.lastThreads && (
        <div className="flex flex-col gap-y-4 w-full h-full">
          <Typography className="text-[24px]">Последние треды</Typography>
          <div className="grid grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
            {relatedState.lastThreads.map((thread) => (
              <div className="flex flex-col group gap-2 justify-between overflow-hidden items-start h-[200px] friend-card">
                <Typography className="text-[18px]">{thread.title}</Typography>
                {thread.description && (
                  <div className="w-full h-[40px] whitespace-pre">
                    <Typography
                      className="text-[16px] truncate"
                      textColor="gray"
                    >
                      {thread.description}
                    </Typography>
                  </div>
                )}
                <Link
                  href={THREAD_URL + thread.id}
                  className="flex items-center w-full"
                >
                  <Button state="default" className="px-6 w-full">
                    <Typography>Перейти к треду</Typography>
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
