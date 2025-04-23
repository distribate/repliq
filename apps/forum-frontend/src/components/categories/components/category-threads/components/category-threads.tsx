import {
  categoryThreadsQuery,
} from "../queries/category-threads-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { ThreadLayout } from "#components/thread/thread-layout/thread-layout.tsx";
import { ThreadByCategoryItem } from "#components/thread/thread-card-category/thread-by-category-item.tsx";
import { ThreadNotFound } from "#components/templates/components/threads-not-found.tsx";

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

export const CategoryThreads = ({ category_id }: { category_id: string }) => {
  const { data, isLoading, isError } = categoryThreadsQuery({
    id: category_id
  });

  if (isLoading) return <CategoryThreadsSkeleton />;

  if (!data || isError) return <ThreadNotFound />;

  const threads = data?.data
  const meta = data?.meta

  const hasMore = meta.hasNextPage

  if (!threads) return null;

  return (
    threads.map((thread) => (
      <ThreadLayout key={thread.id} id={thread.id} title={thread.title} owner={{ nickname: thread.nickname, name_color: thread.name_color }}>
        <ThreadByCategoryItem
          title={thread.title}
          id={thread.id}
          owner={{ nickname: thread.nickname, name_color: thread.name_color }}
          created_at={thread.created_at}
          comments_count={thread.comments_count}
          views_count={thread.views_count}
          properties={{
            is_comments: thread.is_comments
          }}
          description={thread.description}
        />
      </ThreadLayout>
    ))
  );
};