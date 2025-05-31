import { threadsAction, threadsAtom } from '../models/profile-threads.model.ts';
import { ProfileThreadsFiltering } from '#components/profile/threads/components/profile-threads-filtering.tsx';
import { ProfileThreadsListCard } from '#components/profile/threads/components/profile-threads-list-card.tsx';
import { profileThreadsSettingsAtom } from '#components/profile/threads/models/profile-threads-settings.model.ts';
import { SomethingError } from '#components/templates/components/something-error.tsx';
import { ContentNotFound } from '#components/templates/components/content-not-found.tsx';
import { SectionSkeleton } from '#components/templates/components/section-skeleton.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { requestedUserParamAtom } from '#components/profile/main/models/requested-user.model.ts';
import { onConnect } from '@reatom/framework';

const ProfileThreadsList = reatomComponent(({ ctx, }) => {
  const threads = ctx.spy(threadsAtom)
  const isLoading = ctx.spy(threadsAction.statusesAtom).isPending;
  const isError = ctx.spy(threadsAction.statusesAtom).isRejected
  const profileThreadsViewState = ctx.spy(profileThreadsSettingsAtom)
  const { viewType } = profileThreadsViewState;

  if (isLoading) return <SectionSkeleton />
  if (isError) return <SomethingError />;

  if (!threads) return <ContentNotFound title="Треды не найдены" />;

  return (
    <div className={`${viewType === 'grid' ? 'grid-cols-2 grid lg:grid-cols-3 auto-rows-auto' : 'flex flex-col'} gap-4 w-full h-full`}>
      {threads.map((thread) =>
        <ProfileThreadsListCard
          key={thread.id}
          id={thread.id}
          title={thread.title}
          comments_count={thread.comments_count}
          created_at={thread.created_at}
        />
      )}
    </div>
  );
}, "ProfileThreadsList")

onConnect(threadsAction, (ctx) => threadsAction(ctx, ctx.get(requestedUserParamAtom)!))

export const ProfileThreads = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ProfileThreadsFiltering />
      <ProfileThreadsList />
    </div>
  );
};