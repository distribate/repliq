'use client';

import { threadsQuery } from '../queries/threads-query.ts';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ProfileThreadsFiltering } from '#profile/components/threads/components/profile-threads-filtering.tsx';
import { ProfileThreadsListCard } from '#profile/components/threads/components/profile-threads-list-card.tsx';
import dynamic from 'next/dynamic';

const ContentNotFound = dynamic(() =>
  import('#templates/section-not-found.tsx')
  .then(m => m.ContentNotFound),
);

const ThreadsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full py-6">
      <Skeleton className="h-[60px] w-full" />
      <Skeleton className="h-[60px] w-full" />
      <Skeleton className="h-[60px] w-full" />
    </div>
  );
};

export const ProfileThreadsList = ({
  nickname,
}: Pick<UserEntity, 'nickname'>) => {
  const { data: threads, isLoading } = threadsQuery({ nickname, ascending: true });
  
  if (isLoading) return <ThreadsSkeleton />;
  
  if (!threads
    || threads && !threads.length
  ) return <ContentNotFound title="Треды не найдены." />;
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ProfileThreadsFiltering threadsLength={threads.length} />
      {threads.map(thread =>
        <ProfileThreadsListCard key={thread.id} {...thread} />)
      }
    </div>
  );
};