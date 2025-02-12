import { Accordion } from '@repo/ui/src/components/accordion.tsx';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { forumCategoriesClient } from '@repo/shared/api/forum-client.ts';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/src/components/accordion.tsx";
import { Link } from "@tanstack/react-router";
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadItem } from '#thread/thread-item.tsx';
import { CATEGORY_URL } from '@repo/shared/constants/routes';
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp";
import { MainCategoriesSkeleton } from './main-categories-skeleton';
import { lazy, Suspense } from 'react';

const ThreadNotFound = lazy(() => import("#templates/threads-not-found.tsx").then(module => ({
  default: module.ThreadNotFound
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

export const MainCategoriesList = () => {
  const { data: categories, isLoading } = categoriesQuery();

  if (isLoading) return <MainCategoriesSkeleton />

  if (!categories) return null;

  return (
    <Accordion
      type="multiple"
      defaultValue={categories.map(c => c.category_title)}
    >
      <div className="flex flex-col rounded-lg gap-2 w-full">
        {categories.map(c => (
          <div
            key={c.category_id}
            className="flex gap-y-4 w-full py-4 flex-col rounded-lg px-4 bg-primary-color"
          >
            <AccordionItem value={c.category_title}>
              <AccordionTrigger>
                <Link to={CATEGORY_URL + c.category_id} className="flex items-center gap-2 px-2">
                  <Typography textSize="very_big" textColor="shark_white" className="font-bold">
                    {c.category_title}
                  </Typography>
                  <div
                    className="p-1 bg-shark-900/60 rounded-md"
                  >
                    <img src={Spyglass} alt="" width={20} height={20} draggable={false} />
                  </div>
                </Link>
              </AccordionTrigger>
              {c.threads ? (
                <AccordionContent>
                  <div className="flex flex-col gap-y-2 w-full">
                    <Typography className="text-shark-300 text-base font-normal px-2">
                      Треды
                    </Typography>
                    <div className="flex flex-col gap-y-2 w-full h-full">
                      {c.threads.map(t => <ThreadItem key={t.id} {...t} />)}
                    </div>
                  </div>
                </AccordionContent>
              ) : (
                <Suspense>
                  <ThreadNotFound />
                </Suspense>
              )}
            </AccordionItem>
          </div>
        ))}
      </div>
    </Accordion >
  );
};