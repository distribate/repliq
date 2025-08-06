import {
  categoryThreadsAction,
} from "../models/category-threads.model.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { ThreadLayout } from "#components/thread/thread-layout/thread-layout.tsx";
import { ThreadByCategoryItem } from "#components/thread/thread-card-category/thread-by-category-item.tsx";
import { ThreadNotFound } from "#components/templates/components/threads-not-found.tsx";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { categoryThreadFilterAtom } from "../models/category-filter.model.ts";

const CategoryThreadsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full h-full">
      {Array.from({ length: 10 }).map((_, idx) => <Skeleton key={idx} className="h-16 w-full" />)}
    </div>
  );
};

const Sync = ({ target }: { target: string }) => {
  useUpdate((ctx) => categoryThreadsAction(ctx, target), [target])
  return null;
}

const categoryThreadsListLayoutVariants = cva("w-full h-full", {
  variants: {
    variant: {
      grid: "grid lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-4",
      cols: "flex flex-col gap-4"
    }
  },
  defaultVariants: {
    variant: "cols"
  }
})

type CategoryThreadsListLayoutProps = HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof categoryThreadsListLayoutVariants>

const CategoryThreadsListLayout = ({ className, variant, ...props }: CategoryThreadsListLayoutProps) => {
  return <div className={categoryThreadsListLayoutVariants({ className, variant })} {...props} />
}

export const CategoryThreadsList = reatomComponent<{ category_id: string }>(({ ctx, category_id }) => {
  return (
    <CategoryThreadsListLayout variant={ctx.spy(categoryThreadFilterAtom).view}>
      <CategoryThreads category_id={category_id} />
    </CategoryThreadsListLayout>
  )
}, "CategoryThreadsList")

export const CategoryThreads = reatomComponent<{ category_id: string }>(({ ctx, category_id }) => {
  const threads = ctx.spy(categoryThreadsAction.dataAtom)?.data
  const meta = ctx.spy(categoryThreadsAction.dataAtom)?.meta
  const isLoading = ctx.spy(categoryThreadsAction.statusesAtom).isPending
  const isError = ctx.spy(categoryThreadsAction.statusesAtom).isRejected;

  const hasMore = meta?.hasNextPage

  return (
    <>
      <Sync target={category_id} />
      {isLoading && <CategoryThreadsSkeleton />}
      {isError && <ThreadNotFound />}
      {!isLoading && (
        threads && (
          threads.map((thread) => (
            <ThreadLayout
              key={thread.id}
              id={thread.id}
              title={thread.title}
              owner={{
                nickname: thread.nickname,
                name_color: thread.name_color,
                avatar: thread.avatar
              }}
            >
              <ThreadByCategoryItem
                title={thread.title}
                id={thread.id}
                owner={{
                  nickname: thread.nickname,
                  name_color: thread.name_color,
                  avatar: thread.avatar
                }}
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
        )
      )}
    </>
  );
}, "CategoryThreads")