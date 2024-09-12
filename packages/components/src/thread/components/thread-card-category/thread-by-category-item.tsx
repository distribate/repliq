import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { ThreadModel } from '../../queries/get-thread-model.ts';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { ArrowDown, ArrowUp, MessageSquare, MessageSquareOff } from 'lucide-react';

type TopicByCategoryItemProps = Pick<ThreadModel, 'title'
  | 'nickname'
  | 'created_at'
  | 'commentsCount'
  | 'rating'
  | 'comments'
>

export const ThreadByCategoryItem = ({
  ...thread
}: TopicByCategoryItemProps) => {
  const { nickname, created_at, title, rating, commentsCount, comments } = thread;
  
  if (!nickname || !rating) return null;
  
  const createdAt = dayjs(created_at).from(dayjs());

  return (
    <div
      className="flex grow group bg-shark-900 rounded-md justify-between transition-all duration-150 p-3 cursor-pointer">
      <div className="flex flex-col w-full gap-y-2 justify-between">
        <div className="flex items-center min-w-[260px] gap-x-2">
          <Avatar
            nickname={nickname} propWidth={36} propHeight={36}
            className="min-h-[36px] min-w-[36px]"
          />
          <div className="flex flex-col">
            <Typography textColor="shark_white" className="text-sm font-medium">
              {title}
            </Typography>
            <Typography className="text-sm text-shark-300 font-medium">
              {nickname} создал {createdAt}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-2 rounded-md px-2 py-1 border-white/10 border-[1px]">
        <div className="flex items-center gap-1 w-[26px]">
          {comments ? (
            <>
              <MessageSquare className="text-shark-300" size={16} />
              <Typography className="text-shark-300 text-sm font-normal">
                {commentsCount}
              </Typography>
            </>
          ) : <MessageSquareOff className="text-red-500" size={16} />}
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center gap-1 w-[26px]">
          {(rating.increment - rating.decrement) >= 0 ?
            <ArrowUp className="text-shark-300" size={16} /> :
            <ArrowDown className="text-shark-300" size={16} />
          }
          <Typography className="text-shark-300 text-sm font-normal">
            {rating.increment - rating.decrement}
          </Typography>
        </div>
      </div>
    </div>
  );
};