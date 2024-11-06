import { UserThreads } from '#profile/components/threads/queries/get-threads-user.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ArrowUp, MessageSquare, MessageSquareOff } from 'lucide-react';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';

export const ProfileThreadsListCard = ({
  created_at, id, title, comments, commentsCount, rating,
}: UserThreads) => {
  return (
    <div
      className="flex items-center bg-shark-950 px-4 py-2 rounded-lg justify-between"
    >
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-1 w-full">
            <div className="w-fit">
              <Typography
                textColor="shark_white"
                textSize="large"
                className="font-semibold truncate"
              >
                {title}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={THREAD_URL + id} className="w-fit">
              <Button state="default" className="px-4">
                <Typography>Перейти к треду</Typography>
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4 w-full">
            {comments ? (
              <div className="flex items-center gap-1">
                <Typography textSize="medium" textColor="shark_white">
                  {commentsCount}
                </Typography>
                <MessageSquare size={20} className="text-shark-300 font-normal" />
              </div>
            ) : <MessageSquareOff size={20} className="text-red-500 font-normal" />}
            <Separator orientation="vertical" />
            <div className="flex items-center gap-1">
              <Typography textSize="medium" textColor="shark_white">
                {rating}
              </Typography>
              <ArrowUp size={20} className="text-shark-300 font-normal text-sm" />
            </div>
          </div>
          <Typography
            title={dayjs(created_at).format('LL')}
            textSize="medium"
            textColor="gray"
            className="cursor-default"
          >
            {dayjs(created_at).fromNow()}
          </Typography>
        </div>
      </div>
    </div>
  );
};