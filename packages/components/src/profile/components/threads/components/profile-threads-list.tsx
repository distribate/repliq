'use client';

import { profileThreadsQuery } from '../queries/profile-threads-query.ts';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ProfileThreadsFiltering } from '#profile/components/threads/components/profile-threads-filtering.tsx';
import { ProfileThreadsListCard } from '#profile/components/threads/components/profile-threads-list-card.tsx';
import dynamic from 'next/dynamic';
import { profileThreadsSettingsQuery } from '#profile/components/threads/queries/profile-threads-settings-query.ts';

const ContentNotFound = dynamic(() =>
  import('#templates/content-not-found.tsx').then((m) => m.ContentNotFound),
);

const SomethingError = dynamic(() =>
  import('#templates/something-error.tsx').then((m) => m.SomethingError),
);

export const ProfileThreads = ({
  nickname,
}: Pick<UserEntity, 'nickname'>) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ProfileThreadsFiltering nickname={nickname} />
      <ProfileThreadsList nickname={nickname} />
    </div>
  );
};

export const ProfileThreadsList = ({
  nickname,
}: Pick<UserEntity, 'nickname'>) => {
  const { data: threads, isLoading, isError } = profileThreadsQuery(nickname);
  const { data: profileThreadsViewState } = profileThreadsSettingsQuery();
  const { viewType } = profileThreadsViewState;

  if (isLoading) return (
    <div className="flex flex-col gap-y-2 w-full">
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[100px] w-full" />
    </div>
  )

  if (isError) return <SomethingError />;
  if (!threads) return <ContentNotFound title="Треды не найдены." />;

  return (
    <div className={`${viewType === 'grid' ? 'grid grid-cols-3 auto-rows-auto' : 'flex flex-col'} gap-4 w-full h-full`}>
      {threads.map((thread) => <ProfileThreadsListCard key={thread.id} thread={thread} />)}
    </div>
  );
};