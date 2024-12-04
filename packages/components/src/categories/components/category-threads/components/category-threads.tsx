"use client";

import {
  categoryThreadsQuery,
  CategoryThreadsQuery,
} from "../queries/category-threads-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { ThreadLayout } from "#thread/components/thread-layout/thread-layout.tsx";
import { ThreadByCategoryItem } from "#thread/components/thread-card-category/thread-by-category-item.tsx";
import { ThreadNotFound } from "#templates/threads-not-found.tsx";

type CategoryThreads = Pick<CategoryThreadsQuery, "category_id">;

const CategoryThreadsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
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
    </div>
  );
};

export const CategoryThreads = ({ category_id }: CategoryThreads) => {
  const { data: categoryThreads, isLoading } = categoryThreadsQuery({
    category_id,
  });

  if (isLoading) return <CategoryThreadsSkeleton />;

  if (!categoryThreads) return <ThreadNotFound />;

  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      {categoryThreads.map((thread) => (
        <ThreadLayout id={thread.id} title={thread.title} owner={thread.owner}>
          <ThreadByCategoryItem {...thread} />
        </ThreadLayout>
      ))}
    </div>
  );
};
