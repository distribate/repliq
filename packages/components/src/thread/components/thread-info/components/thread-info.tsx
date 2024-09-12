import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { getCategoryOfThreadTitle } from '@repo/lib/queries/get-category-info-of-thread.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { CATEGORY_URL, USER_URL } from '@repo/shared/constants/routes.ts';

export const ThreadInfo = async(thread: ThreadModel) => {
  const categoryByTitle = await getCategoryOfThreadTitle(thread.id);
  
  return (
    <div className="flex flex-col gap-y-4 py-2">
      <Typography textSize="big" className="font-semibold" textColor="shark_white">
        {thread.title}
      </Typography>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-1">
          <Typography>
            Категория:
          </Typography>
          <Link href={CATEGORY_URL + categoryByTitle.id}>
            <Typography className="font-medium">
              {categoryByTitle.title}
            </Typography>
          </Link>
        </div>
        <Typography>Пользователь:&nbsp;
          <Link href={USER_URL + thread.nickname}>
            {thread.nickname}
          </Link>
        </Typography>
        <Typography>Время: {thread.created_at}</Typography>
      </div>
    </div>
  );
}