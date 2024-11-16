'use client';

import { categoryThreadsQuery, CategoryThreadsQuery } from '../queries/category-threads-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { ThreadLayout } from '#thread/components/thread-layout/thread-layout.tsx';
import { ThreadByCategoryItem } from '#thread/components/thread-card-category/thread-by-category-item.tsx';
import { ThreadNotFound } from '#templates/threads-not-found.tsx';

type CategoryThreads = Pick<CategoryThreadsQuery, 'categoryId'>

export const CategoryThreads = ({
  categoryId
}: CategoryThreads) => {
  const { data: categoryThreads, isLoading } = categoryThreadsQuery({ categoryId });
  
  if (!categoryThreads) return <ThreadNotFound/>
  
  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      {isLoading && (
        <>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </>
      )}
      {categoryThreads.map(thread => (
        <ThreadLayout id={thread.id} title={thread.title} owner={thread.owner}>
          <ThreadByCategoryItem {...thread} />
        </ThreadLayout>
      ))}
    </div>
  );
};