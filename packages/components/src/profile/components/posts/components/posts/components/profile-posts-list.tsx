'use client';

import { postsQuery } from '../queries/posts-query.ts';
import dynamic from 'next/dynamic';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import {
  ProfilePostsFiltering,
} from '#profile/components/posts/components/posts/components/profile-posts-filtering.tsx';
import {
  ProfilePostsListCard,
} from '#profile/components/posts/components/posts/components/profile-posts-list-card.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { postsFilteringQuery } from '#profile/components/posts/components/posts/queries/posts-filtering-query.ts';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Separator } from '@repo/ui/src/components/separator.tsx';

const SomethingError = dynamic(() =>
  import('#templates/something-error.tsx').then(m => m.SomethingError),
);

export type ProfilePostsListProps = Pick<UserEntity, 'nickname'>

const ProfilePostsListSkeleton = () => {
  return (
    <>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </>
  );
};

export const ProfilePostsList = ({
  nickname,
}: ProfilePostsListProps) => {
  const { data: filteringQuery } = postsFilteringQuery();
  const [ limit, setLimit ] = useState(5);
  const [ hasMore, setHasMore ] = useState(true);
  const { ref, inView } = useInView({ threshold: 1 });
  
  const { data: postsData, isError, isLoading, refetch } = postsQuery({
    nickname, range: [ 0, limit ],
    searchQuery: filteringQuery?.searchQuery,
    filteringType: filteringQuery?.filteringType,
  });
  
  const posts = postsData?.data?.filter(post => !post.isPinned) || [];
  const pinnedPost = postsData?.data?.find(post => post.isPinned);
  const postsMeta = postsData?.meta;
  
  useEffect(() => {
    if (inView && hasMore) {
      setLimit(prev => prev + 5);
    }
  }, [ inView, hasMore ]);
  
  useEffect(() => {
    setHasMore(postsMeta?.count! >= limit);
  }, [ postsMeta, limit ]);
  
  useEffect(() => {
    refetch();
  }, [ filteringQuery?.searchQuery, filteringQuery?.filteringType, limit ]);
  
  if (isError) return <SomethingError />;
  
  const notFound = !postsData?.data || !postsData?.data?.length;
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {(!notFound && !isLoading) && <ProfilePostsFiltering />}
      {(notFound && !isLoading) && <ContentNotFound title="Постов не найдено." />}
      {isLoading && <ProfilePostsListSkeleton />}
      {(!isLoading && postsData) && (
        <>
          {pinnedPost && (
            <>
              <ProfilePostsListCard nickname={nickname} {...pinnedPost} />
              <Separator />
            </>
          )}
          {posts.map(post => (
            <ProfilePostsListCard key={post.id} nickname={nickname} {...post} />
          ))}
          {hasMore && <div ref={ref} className="h-[2px] w-full relative" />}
        </>
      )}
    </div>
  );
};