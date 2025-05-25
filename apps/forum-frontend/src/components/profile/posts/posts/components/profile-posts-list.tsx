import { postsAction, postsDataAtom, postsMetaAtom } from '../models/posts.model.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ContentNotFound } from '#components/templates/components/content-not-found.tsx';
import {
  ProfilePostsFiltering,
} from '#components/profile/posts/posts/components/profile-posts-filtering.tsx';
import {
  ProfilePostsListCard,
} from '#components/profile/posts/posts/components/profile-posts-list-card.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { SomethingError } from '#components/templates/components/something-error.tsx';
import { updatePostsAction } from '../models/update-posts.model.ts';
import { SectionSkeleton } from '#components/templates/components/section-skeleton.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { requestedUserParamAtom } from '#components/profile/requested-user.model.ts';

const PostsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

const ProfilePostsList = reatomComponent(({ ctx }) => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 1 });

  const postsData = ctx.spy(postsDataAtom)
  const postsMeta = ctx.spy(postsMetaAtom)
  const isLoadingUpdated = ctx.spy(updatePostsAction.statusesAtom).isPending
  const nickname = ctx.spy(requestedUserParamAtom)
  const hasMore = postsMeta?.hasNextPage;

  useEffect(() => {
    if (nickname && inView && hasMore) {
      updatePostsAction(ctx, { nickname, type: "update-cursor" })
    };
  }, [inView, hasMore, nickname]);

  if (ctx.spy(postsAction.statusesAtom).isPending) return <SectionSkeleton />;
  if (ctx.spy(postsAction.statusesAtom).isRejected) return <SomethingError />;

  if (!postsData || !postsData.length) return <ContentNotFound title="Посты не найдены" />;

  const posts = postsData.filter(p => !p.isPinned);
  const pinnedPost = postsData.find(p => p.isPinned);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {pinnedPost && (
        <>
          <ProfilePostsListCard {...pinnedPost} />
          <Separator />
        </>
      )}
      {posts.map(p => <ProfilePostsListCard key={p.id} {...p} />)}
      {isLoadingUpdated && <PostsSkeleton />}
      {hasMore && <div ref={ref} className="h-[1px] w-full" />}
    </div>
  );
}, "ProfilePostsList")

export const ProfilePosts = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ProfilePostsFiltering />
      <ProfilePostsList />
    </div>
  );
};