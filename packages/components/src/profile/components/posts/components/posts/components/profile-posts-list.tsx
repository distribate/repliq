'use client';

import { postsQuery } from '../queries/posts-query.ts';
import dynamic from 'next/dynamic';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ContentNotFound } from '#templates/section-not-found.tsx';
import {
  ProfilePostsFiltering
} from '#profile/components/posts/components/posts/components/profile-posts-filtering.tsx';
import {
  ProfilePostsListCard
} from '#profile/components/posts/components/posts/components/profile-posts-list-card.tsx';

const SomethingError = dynamic(() =>
  import('#templates/something-error.tsx')
  .then(m => m.SomethingError),
);

export type ProfilePostsListProps = {
  nickname: string
}

export const ProfilePostsList = ({
  nickname,
}: ProfilePostsListProps) => {
  const { data: posts, isError, isLoading } = postsQuery({ nickname, limit: 10 });
  
  if (isError) return <SomethingError />;
  
  if (!posts
    || posts && !posts.length
  ) return <ContentNotFound title="Постов не найдено." />;
  
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ProfilePostsFiltering postsLength={posts.length} />
      {isLoading ? (
        <>
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </>
      ) : (
        posts.map(post => (
          <ProfilePostsListCard {...post} nickname={nickname} />
        )))
      }
    </div>
  );
};