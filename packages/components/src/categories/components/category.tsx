import Link from 'next/link';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/src/components/accordion.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import Spyglass from '@repo/assets/images/minecraft/spyglass.webp';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';
import { ThreadNotFound } from '#templates/threads-not-found.tsx';
import { CATEGORY_URL } from '@repo/shared/constants/routes.ts';
import { CategoryModel } from '../queries/get-categories.ts';
import { getThreadsCategories } from '@repo/lib/queries/get-threads-by-category.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { ThreadItem } from '#thread/thread-item.tsx';

type CategoryBlockProps = CategoryModel

export const Category = async({
  title, id, threads: hasThreads,
}: CategoryBlockProps) => {
  let threads: ThreadEntity[] | null = [];
  
  if (hasThreads) {
    threads = await getThreadsCategories({
      categoryId: id.toString(), limit: 3,
    });
  }
  
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>
        <div className="flex items-center gap-2 px-2">
          <Typography textSize="very_big" textColor="shark_white" className="font-bold">
            {title}
          </Typography>
          <Link href={CATEGORY_URL + id}>
            <ImageWrapper
              propSrc={Spyglass.src}
              propAlt={`перейти к категории ${title}`}
              width={20}
              height={20}
            />
          </Link>
        </div>
      </AccordionTrigger>
      {hasThreads && threads ? (
        <AccordionContent>
          <div className="flex flex-col gap-y-2 w-full">
            <Typography className="text-shark-300 text-base font-normal px-2">
              Темы
            </Typography>
            <div className="flex flex-col gap-y-2 w-full h-full">
              {threads.map(item => <ThreadItem key={item.id} id={item.id} />)}
            </div>
          </div>
        </AccordionContent>
      ) : <ThreadNotFound />}
    </AccordionItem>
  );
};