import { MetadataType, PageConventionProps } from '@repo/types/config/page-types.ts';
import { notFound, redirect } from 'next/navigation';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Metadata } from 'next';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { getCategory } from '@repo/lib/queries/get-category.ts';
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx';
import {
  CategoryThreads,
} from '@repo/components/src/categories/components/category-threads/components/category-threads.tsx';
import { QueryClient } from '@tanstack/react-query';
import {
  CATEGORY_THREADS_QUERY_KEY,
} from '@repo/components/src/categories/components/category-threads/queries/category-threads-query.ts';
import { getThreadsCategories } from '@repo/lib/queries/get-threads-by-category.ts';

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { id } = params;
  let title: string;
  
  if (!id) return { title: 'none' };
  
  const category = await getCategory(id);
  
  if (!category) {
    return { title: 'none' };
  }
  
  title = category.title;
  
  return {
    title: title,
  };
}

export default async function CategoryByIdPage({
  params,
}: PageConventionProps) {
  const { id } = params;
  if (!id) redirect('/');
  
  const qc = new QueryClient();
  
  const category = await getCategory(id);
  if (!category) return notFound();
  
  await qc.prefetchQuery({
    queryKey: CATEGORY_THREADS_QUERY_KEY(category.id),
    queryFn: () => getThreadsCategories({
      categoryId: category.id,
    }),
  });
  
  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 w-full overflow-hidden">
      <div className="flex flex-col gap-y-4 flex-grow-0 min-w-0 w-full lg:w-3/4">
        <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
          <div className="flex items-center gap-2 px-2">
            <Typography textSize="very_big" textColor="shark_white" className="font-bold">
              {category.title}
            </Typography>
            {category.description && (
              <>
                <Separator orientation="vertical" />
                <Typography>{category.description}</Typography>
              </>
            )}
          </div>
        </BlockWrapper>
        <BlockWrapper className="flex flex-col gap-y-4 w-full overflow-hidden !px-4 py-2">
          <div className="flex flex-col w-full px-2">
            Filtration
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <CategoryThreads categoryId={category.id}/>
          </div>
        </BlockWrapper>
      </div>
      <BlockWrapper className="flex flex-col gap-y-4 w-full lg:!w-1/4 flex-grow-0 sticky min-w-0 !p-4 top-0 h-fit">
        s
      </BlockWrapper>
    </div>
  );
}