import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { getCategoryOfThreadTitle } from '@repo/lib/queries/get-category-info-of-thread.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { CATEGORY_URL } from '@repo/shared/constants/routes.ts';

type ThreadInfoProps = Pick<ThreadModel, "id">

export const ThreadInfo = async({
  id: threadId
}: ThreadInfoProps) => {
  const categoryByTitle = await getCategoryOfThreadTitle(threadId);
  
  if (!categoryByTitle) return null;
  
  return (
    <Link href={CATEGORY_URL + categoryByTitle.id} className="flex py-2">
      <Typography className="font-medium" textSize="large">
        {categoryByTitle.title}
      </Typography>
    </Link>
  );
};