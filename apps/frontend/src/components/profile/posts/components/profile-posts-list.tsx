import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ContentNotFound } from '#components/templates/components/content-not-found.tsx';
import { ProfilePostsListCard } from '#components/profile/posts/components/profile-posts-list-card.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { SomethingError } from '#components/templates/components/something-error.tsx';
import { SectionSkeleton } from '#components/templates/components/section-skeleton.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { postsAction, postsDataAtom, postsNotPinnedDataAtom, postsPinnedDataAtom, ProfilePostsViewer, updatePostsAction } from '../models/posts.model';

const PostsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

const ProfilePinnedPosts = reatomComponent(({ ctx }) => {
  const data = ctx.spy(postsPinnedDataAtom)[0] // only 1 post

  if (!data) return null;

  return (
    <>
      <ProfilePostsListCard {...data} />
      <Separator />
    </>
  )
}, "ProfilePinnedPosts")

const ProfileNotPinnedPosts = reatomComponent(({ ctx }) => {
  const data = ctx.spy(postsNotPinnedDataAtom)

  return data.map(post => <ProfilePostsListCard key={post.id} {...post} />)
}, "ProfileNotPinnedPosts")

export const ProfilePostsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(postsDataAtom);

  if (ctx.spy(postsAction.statusesAtom).isPending) {
    return <SectionSkeleton />;
  }

  if (ctx.spy(postsAction.statusesAtom).isRejected) {
    return <SomethingError />;
  }

  if (!data || !data.length) {
    return <ContentNotFound title="Посты не найдены" />;
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <ProfilePinnedPosts />
      <ProfileNotPinnedPosts />
      {ctx.spy(updatePostsAction.statusesAtom).isPending && <PostsSkeleton />}
    </div>
  );
}, "ProfilePostsList")