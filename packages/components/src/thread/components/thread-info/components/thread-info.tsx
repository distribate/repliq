import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { getCategoryOfThreadTitle } from '@repo/lib/queries/get-category-info-of-thread.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { CATEGORY_URL } from '@repo/shared/constants/routes.ts';

export const ThreadInfo = async(thread: ThreadModel) => {
  const categoryByTitle = await getCategoryOfThreadTitle(thread.id);
  
  return (
    <Link href={CATEGORY_URL + categoryByTitle.id} className="flex py-2">
      <Typography className="font-medium" textSize="large">
        {categoryByTitle.title}
      </Typography>
    </Link>
  );
};