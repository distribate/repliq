import { ThreadModel } from '../../../queries/get-thread.ts';
import { getCategoryOfThreadTitle } from '@repo/lib/queries/get-category-info-of-thread.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { ThreadBump } from '../../thread-bump/components/thread-bump.tsx';

export const ThreadInfo = async(thread: ThreadModel) => {
  const categoryTitle = await getCategoryOfThreadTitle({
    thread_id: thread.id,
  });
  
  return (
    <div className="flex flex-col gap-y-4 py-2">
      <Typography
        textSize="big"
        className="font-semibold"
        textColor="shark_white"
      >
        Тред: {thread.title}
      </Typography>
      <div className="flex flex-col items-start gap-2">
        <Typography>
          Категория:&nbsp;
          <Link
            href={`/category/${categoryTitle.id}`}
            className="font-medium"
          >
            {categoryTitle.title}
          </Link>
        </Typography>
        <Typography>
          Пользователь:&nbsp;
          <Link href={`/user/${thread.nickname}`} style={{ color: thread.nicknameColor }}>
            {thread.nickname}
          </Link>
        </Typography>
        <Typography>Время: {thread.created_at}</Typography>
      </div>
      <Separator />
      {thread.rating && (
        <ThreadBump thread_id={thread.id} />
      )}
    </div>
  );
}