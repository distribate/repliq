import { threadsAction } from '../models/profile-threads.model.ts';
import { ProfileThreadsFiltering } from '#components/profile/threads/components/profile-threads-filtering.tsx';
import { ProfileThreadsListCard } from '#components/profile/threads/components/profile-threads-list-card.tsx';
import { profileThreadsSettingsAtom } from '#components/profile/threads/models/profile-threads-settings.model.ts';
import { SomethingError } from '#components/templates/components/something-error.tsx';
import { ContentNotFound } from '#components/templates/components/content-not-found.tsx';
import { SectionSkeleton } from '#components/templates/components/section-skeleton.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { requestedUserParamAtom } from '#components/profile/main/models/requested-user.model.ts';
import { onConnect } from '@reatom/framework';
import { cva } from 'class-variance-authority';

const wrapperVariants = cva(`gap-4 w-full h-full`, {
  variants: {
    variant: {
      list: "flex flex-col",
      grid: "grid-cols-2 grid lg:grid-cols-3 auto-rows-auto"
    }
  }
})

const ProfileThreadsList = reatomComponent(({ ctx, }) => {
  const threads = ctx.spy(threadsAction.dataAtom)
  const profileThreadsViewState = ctx.spy(profileThreadsSettingsAtom)

  if (ctx.spy(threadsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }
  
  if (ctx.spy(threadsAction.statusesAtom).isRejected) {
    return <SomethingError />;
  }

  const isExist = threads && threads.length >= 1

  if (!isExist) {
    return <ContentNotFound title="Треды не найдены" />;
  }

  const variant = profileThreadsViewState.viewType;

  return (
    <div className={wrapperVariants({ variant })}>
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