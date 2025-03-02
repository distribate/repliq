import { postsQuery } from '../queries/posts-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ContentNotFound } from '#components/templates/content-not-found.tsx';
import {
  ProfilePostsFiltering,
} from '#components/profile/posts/posts/components/profile-posts-filtering.tsx';
import {
  ProfilePostsListCard,
} from '#components/profile/posts/posts/components/profile-posts-list-card.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { SomethingError } from '#components/templates/something-error.tsx';
import { useMutationState } from '@tanstack/react-query';
import { UPDATE_POSTS_MUTATION_KEY, useUpdatePosts } from '../hooks/use-update-posts.ts';

const PostsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

export const ProfilePostsList = ({
  nickname,
}: Pick<UserEntity, 'nickname'>) => {
  const { data, isError, isLoading } = postsQuery(nickname);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 1 });
  const { updatePostsMutation } = useUpdatePosts()

  const mutData = useMutationState({
    filters: { mutationKey: UPDATE_POSTS_MUTATION_KEY },
    select: m => m.state.status
  })

  const isLoadingUpdated = mutData[mutData.length - 1] === "pending";
  const postsData = data?.data;
  const postsMeta = data?.meta;
  const hasMore = postsMeta?.hasNextPage;

  useEffect(() => {
    if (inView && hasMore) updatePostsMutation.mutate({ nickname, type: "update-cursor" });
  }, [inView, hasMore]);

  if (isLoading) return <PostsSkeleton />;

  if (isError) return <SomethingError />;

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
};

export const ProfilePosts = ({
  nickname,
}: Pick<UserEntity, 'nickname'>) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ProfilePostsFiltering nickname={nickname} />
      <ProfilePostsList nickname={nickname} />
    </div>
  );
};