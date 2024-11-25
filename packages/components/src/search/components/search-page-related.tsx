import { Typography } from '@repo/ui/src/components/typography.tsx';
import { FriendsSearchingCard } from '#friends/components/searching/friends-searching-card.tsx';
import { relatedQuery } from '#search/queries/related-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

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
            {relatedState.lastUsers.map(user => (
              <FriendsSearchingCard key={user.nickname} {...user} donate="default" />
            ))}
          </div>
        </div>
      )}
      {relatedState.lastThreads && (
        <div className="flex flex-col gap-y-4 w-full h-full">
          <Typography className="text-[24px]">
            Последние треды
          </Typography>
          <div className="grid grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
            {relatedState.lastThreads.map(thread => (
              <div className="flex flex-col group gap-4 justify-between items-center h-[280px] friend-card">
                {thread.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};