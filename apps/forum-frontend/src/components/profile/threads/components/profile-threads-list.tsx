import { profileThreadsQuery } from '../queries/profile-threads-query.ts';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ProfileThreadsFiltering } from '#components/profile/threads/components/profile-threads-filtering.tsx';
import { ProfileThreadsListCard } from '#components/profile/threads/components/profile-threads-list-card.tsx';
import { profileThreadsSettingsQuery } from '#components/profile/threads/queries/profile-threads-settings-query.ts';
import { SomethingError } from '#components/templates/something-error.tsx';
import { ContentNotFound } from '#components/templates/content-not-found.tsx';

const ProfileThreadsList = ({
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
  if (!threads) return <ContentNotFound title="Треды не найдены" />;

  return (
    <div className={`${viewType === 'grid' ? 'grid-cols-2 grid lg:grid-cols-3 auto-rows-auto' : 'flex flex-col'} gap-4 w-full h-full`}>
      {threads.map((thread) => <ProfileThreadsListCard key={thread.id} thread={thread} />)}
    </div>
  );
};

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