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
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp";
import { ThreadNotFound } from "#templates/threads-not-found.tsx";
import { MainCategoriesSkeleton } from './main-categories-skeleton';

const categoriesQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["categories"]),
  queryFn: () => getMainCategoriesWithThreads(),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchInterval: 86000,
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
      defaultValue={[
        ...categories.map(({ category_id, category_title, threads }) => category_title)
      ]}
    >
      <div className="flex flex-col rounded-lg gap-2 w-full">
        {categories.map(({ category_id, category_title, threads }) => (
          <div key={category_id} className="flex gap-y-4 w-full py-4 border border-shark-800 flex-col rounded-lg px-4 bg-primary-color">
            <AccordionItem value={category_title}>
              <AccordionTrigger>
                <div className="flex items-center gap-2 px-2">
                  <Typography
                    textSize="very_big"
                    textColor="shark_white"
                    className="font-bold"
                  >
                    {category_title}
                  </Typography>
                  <Link to={CATEGORY_URL + category_id}>
                    <ImageWrapper
                      propSrc={Spyglass}
                      propAlt={`перейти к категории ${category_title}`}
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
              </AccordionTrigger>
              {threads ? (
                <AccordionContent>
                  <div className="flex flex-col gap-y-2 w-full">
                    <Typography className="text-shark-300 text-base font-normal px-2">
                      Темы
                    </Typography>
                    <div className="flex flex-col gap-y-2 w-full h-full">
                      {threads.map(thread => <ThreadItem key={thread.id} {...thread} />)}
                    </div>
                  </div>
                </AccordionContent>
              ) : (
                <ThreadNotFound />
              )}
            </AccordionItem>
          </div>
        ))}
      </div>
    </Accordion>
  );
};