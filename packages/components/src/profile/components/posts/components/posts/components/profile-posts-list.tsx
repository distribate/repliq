'use client';

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
import {
  POSTS_DEFAULT_MAX_RANGE,
  POSTS_FILTERING_QUERY_KEY, PostsFilteringQuery,
} from '#profile/components/posts/components/posts/queries/posts-filtering-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { SomethingError } from '#templates/something-error.tsx';

const PostsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
    </div>
  );
};

const ProfilePostsList = ({
  nickname,
}: Pick<UserEntity, 'nickname'>) => {
  const qc = useQueryClient();
  const { data, isError, isLoading, refetch, isFetching } = postsQuery(nickname);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 1 });
  
  const postsData = data?.data;
  const postsMeta = data?.meta!;
  const hasMore = postsData && postsData.length < postsMeta.count;
  
  const increasePostRange = () => {
    return qc.setQueryData(POSTS_FILTERING_QUERY_KEY, (prev: PostsFilteringQuery) => ({
      ...prev,
      range: [ prev.range[0], prev.range[1] + POSTS_DEFAULT_MAX_RANGE ],
    }));
  };
  
  useEffect(() => {
    if (inView && hasMore) {
      increasePostRange();
      refetch();
    }
  }, [ inView, refetch ]);
  
  if (isLoading) return <PostsSkeleton />;
  if (isError) return <SomethingError />;
  if (!postsData || !postsData.length) return <ContentNotFound title="Постов не найдено." />;
  
  const posts = postsData.filter(
    post => !post.isPinned,
  );
  
  const pinnedPost = postsData.find(
    post => post.isPinned,
  );
  
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