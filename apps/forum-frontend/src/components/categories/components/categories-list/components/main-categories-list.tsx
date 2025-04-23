import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { forumCategoriesClient } from '@repo/shared/api/forum-client.ts';
import { Link } from "@tanstack/react-router";
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { CATEGORY_URL } from '@repo/shared/constants/routes';
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp";
import { lazy, Suspense } from 'react';
import { Separator } from '@repo/ui/src/components/separator';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog';
import { ThreadByCategoryItem } from '#components/thread/thread-card-category/thread-by-category-item';
import { ThreadPreview } from '@repo/types/entities/thread-type';
import { ThreadLayout } from '#components/thread/thread-layout/thread-layout';
import { Skeleton } from '@repo/ui/src/components/skeleton';

const ThreadNotFound = lazy(() => import("#components/templates/components/threads-not-found").then(m => ({
  default: m.ThreadNotFound
})));

export const MAIN_CATEGORIES_QUERY_KEY = createQueryKey("ui", ["categories"]);

const categoriesQuery = () => useQuery({
  queryKey: MAIN_CATEGORIES_QUERY_KEY,
  queryFn: () => getMainCategoriesWithThreads(),
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData
})

async function getMainCategoriesWithThreads() {
  const res = await forumCategoriesClient.categories["get-latest-category-threads"].$get();

  const data = await res.json();

  if (!data || "error" in data) {
    return null
  }

  return data.data;
}

const ThreadItem = ({
  created_at, description, id, properties, title, comments_count, views_count, owner
}: ThreadPreview) => {
  return (
    <ThreadLayout id={id} title={title} owner={owner}>
      <ThreadByCategoryItem
        created_at={created_at}
        description={description}
        id={id}
        properties={properties}
        title={title}
        comments_count={comments_count}
        views_count={views_count}
        owner={owner}
      />
    </ThreadLayout>
  );
};

const MainCategoriesSkeleton = () => {
  return (
    <>
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </>
  );
};

export const MainCategoriesList = () => {
  const { data: categories, isLoading } = categoriesQuery();

  if (isLoading) return <MainCategoriesSkeleton />

  if (!categories) return null;

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="flex flex-col rounded-lg gap-2 w-full">
        {categories.map(c => (
          <div
            key={c.category_id}
            className="flex flex-col gap-y-4 w-full py-8 rounded-lg px-4 bg-primary-color"
          >
            <div className="flex items-center w-fit gap-2">
              <Typography textSize="very_big" textColor="shark_white" className="font-bold">
                {c.category_title}
              </Typography>
            </div>
            {c.threads ? (
              <div className="flex flex-col gap-y-2 w-full">
                <Typography className="text-shark-300 text-base font-normal px-2">
                  Треды
                </Typography>
                <div className="flex flex-col gap-y-2 w-full h-full">
                  {c.threads.map(t => <ThreadItem key={t.id} {...t} />)}
                </div>
              </div>
            ) : (
              <Suspense>
                <ThreadNotFound />
              </Suspense>
            )}
            <Separator />
            <div className="flex items-center gap-2 w-fit h-full">
              <Link
                to={CATEGORY_URL + c.category_id}
                className="flex gap-2 items-center justify-start hover:bg-shark-700 transition-all duration-300 ease-in-out group bg-shark-900 px-2 py-1 rounded-md"
              >
                <img src={Spyglass} alt="" width={20} height={20} draggable={false} />
                <Typography>
                  Все треды
                </Typography>
              </Link>
              <Dialog>
                <DialogTrigger>
                  <div className="flex gap-2 items-center justify-start hover:bg-shark-700 transition-all duration-300 ease-in-out group bg-shark-900 px-2 py-1 rounded-md">
                    <Typography>
                      О категории
                    </Typography>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col items-center justify-center gap-y-4 w-full">
                    <Typography variant="dialogTitle">
                      {c.category_title}
                    </Typography>
                    <div className="flex flex-col gap-2 p-2 w-full">
                      <Typography>
                        {c.category_description ?? "Описания пока нет"}
                      </Typography>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};