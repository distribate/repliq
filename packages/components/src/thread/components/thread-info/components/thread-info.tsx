import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { getCategoryOfThreadTitle } from '@repo/lib/queries/get-category-info-of-thread.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { ThreadBump } from '../../thread-bump/components/thread-bump.tsx';
import { CATEGORY_URL, USER_URL } from '@repo/shared/constants/routes.ts';

export const ThreadInfo = async(thread: ThreadModel) => {
  const categoryByTitle = await getCategoryOfThreadTitle(thread.id);
  
  return (
    <div className="flex flex-col gap-y-4 py-2">
      <Typography textSize="big" className="font-semibold" textColor="shark_white">
        Тред: {thread.title}
      </Typography>
      <div className="flex flex-col items-start gap-2">
        <Typography>Категория:&nbsp;
          <Link href={CATEGORY_URL + categoryByTitle.id}>
            <Typography className="font-medium">
              {categoryByTitle.title}
            </Typography>
          </Link>
        </Typography>
        <Typography>Пользователь:&nbsp;
          <Link href={USER_URL + thread.nickname}>
            {thread.nickname}
          </Link>
        </Typography>
        <Typography>Время: {thread.created_at}</Typography>
      </div>
      <Separator />
      {thread.rating && <ThreadBump thread_id={thread.id} />}
    </div>
  );
}