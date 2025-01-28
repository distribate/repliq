import { postsQuery } from '../queries/posts-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ContentNotFound } from '#templates/content-not-found.tsx';
import {
  ProfilePostsFiltering,
} from '#profile/components/posts/components/posts/components/profile-posts-filtering.tsx';
import {
  ProfilePostsListCard,
} from '#profile/components/posts/components/posts/components/profile-posts-list-card.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { SomethingError } from '#templates/something-error.tsx';
import { postsFilteringQuery } from '../queries/posts-filtering-query.ts';

const PostsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

const ProfilePostsList = ({
  nickname,
}: Pick<UserEntity, 'nickname'>) => {
  const { data: { filteringType, ascending } } = postsFilteringQuery();
  const { data, isError, isLoading, refetch, isFetching } = postsQuery(nickname, filteringType, ascending);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 1 });

  const postsData = data?.data;
  const postsMeta = data?.meta;
  const hasMore = postsMeta?.hasNextPage;

  useEffect(() => {
    if (inView && hasMore) {
      refetch();
    }
  }, [inView, refetch]);

  if (isLoading) return <PostsSkeleton />;
  if (isError) return <SomethingError />;

  if (!postsData || !postsData.length) {
    return <ContentNotFound title="Постов не найдено." />;
  }

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
      {posts.map(post => <ProfilePostsListCard key={post.id} {...post} />)}
      {(isFetching && hasMore) && <PostsSkeleton />}
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