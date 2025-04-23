import { Typography } from "@repo/ui/src/components/typography.tsx";
import { relatedQuery } from "#components/search/queries/related-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Link, useNavigate } from "@tanstack/react-router";
import { THREAD_URL, USER_URL } from "@repo/shared/constants/routes.ts";
import { Suspense } from "react";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/components/nickname";

const SearchPageRelatedSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-8 w-full h-full">
      <div className="flex flex-col gap-y-4 w-full h-full">
        <Skeleton className="w-64 h-8" />
        <div className="grid grid-cols-2 xl:grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
          <Skeleton className="w-full h-[280px]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-full h-full">
        <Skeleton className="w-64 h-8" />
        <div className="grid grid-cols-2 xl:grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
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

export const SearchRelatedUsers = () => {
  const { data: relatedState, isLoading } = relatedQuery();
  const navigate = useNavigate();

  if (isLoading) return <SearchPageRelatedSkeleton />;

  if (!relatedState || !relatedState.lastUsers) return null;
  
  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      <Typography className="font-semibold" textSize="very_big">
        Последние зарегистрированные игроки
      </Typography>
      <div className="grid grid-cols-2 xl:grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
        {relatedState.lastUsers.map(({ nickname }) => (
          <div className="flex flex-col group gap-2 justify-between items-center lg:h-[280px] friend-card">
            <Suspense fallback={<Skeleton className="w-[128px] h-[128px]" />}>
              <Link to={USER_URL + nickname}>
                <Avatar nickname={nickname} propWidth={128} propHeight={128} />
              </Link>
            </Suspense>
            <div className="flex flex-col items-start gap-1 w-full justify-start">
              <Link to={USER_URL + nickname}>
                <UserNickname nickname={nickname} />
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2 *:w-full w-full">
              <Button
                variant="positive"
                onClick={() => navigate({ to: USER_URL + nickname })}
              >
                <Typography textSize="medium">
                  К профилю
                </Typography>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const SearchRelatedThreads = () => {
  const { data: relatedState } = relatedQuery();

  if (!relatedState || !relatedState.lastThreads) return null;

  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      <Typography className="font-semibold" textSize="very_big">
        Последние треды
      </Typography>
      <div className="grid grid-cols-2 xl:grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
        {relatedState.lastThreads.map((thread) => (
          <div key={thread.id} className="flex flex-col group gap-2 justify-between overflow-hidden items-start h-[200px] friend-card">
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
              to={THREAD_URL + thread.id}
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
  )
}