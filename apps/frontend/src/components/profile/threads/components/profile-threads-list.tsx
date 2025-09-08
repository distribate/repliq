import { isExistAtom, profileThreadsAction, profileThreadsDataAtom } from '../models/profile-threads.model.ts';
import { ProfileThreadsListCard } from '#components/profile/threads/components/profile-threads-list-card.tsx';
import { profileThreadsViewAtom } from '#components/profile/threads/models/profile-threads-settings.model.ts';
import { SomethingError } from '#components/templates/components/something-error.tsx';
import { ContentNotFound } from '#components/templates/components/content-not-found.tsx';
import { SectionSkeleton } from '#components/templates/components/section-skeleton.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { cva } from 'class-variance-authority';

const wrapperVariants = cva(`w-full h-full gap-2`, {
  variants: {
    variant: {
      list: "flex flex-col",
      grid: "grid grid-cols-2 lg:grid-cols-3 auto-rows-auto"
    }
  }
})

export const ProfileThreadsList = reatomComponent(({ ctx, }) => {
  const data = ctx.spy(profileThreadsDataAtom)

  if (ctx.spy(profileThreadsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (ctx.spy(profileThreadsAction.statusesAtom).isRejected) {
    return <SomethingError />;
  }

  const isExist = ctx.spy(isExistAtom)

  if (!isExist || !data) {
    return <ContentNotFound title="Треды не найдены" />;
  }

  const view = ctx.spy(profileThreadsViewAtom)

  return (
    <div className={wrapperVariants({ variant: view })}>
      {data.map((thread) =>
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