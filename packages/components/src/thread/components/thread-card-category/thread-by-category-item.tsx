import { Typography } from '@repo/ui/src/components/typography.tsx';
import { UserNickname } from '../../../user/components/name/components/nickname.tsx';
import { MessageSquare, ChevronRight, Folder, Plus, Minus, MessageSquareOff } from 'lucide-react';
import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { ThreadModel } from '../../queries/get-thread.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';

type TopicByCategoryItemProps = Pick<ThreadModel, 'title'
  | 'nickname'
  | 'nicknameColor'
  | 'created_at'
  | 'commentsCount'
  | 'rating'
  | 'comments'
>

export const ThreadByCategoryItem = ({
  ...thread
}: TopicByCategoryItemProps) => {
  
  const { nicknameColor, nickname, created_at, title, rating, commentsCount, comments } = thread;
  
  if (!nickname || !nicknameColor) return null;
  
  return (
    <div
      className="flex gap-y-2 grow group bg-shark-900 rounded-md justify-between transition-all duration-200 px-4 py-2 cursor-pointer">
      <div className="flex flex-col w-full gap-y-2 justify-between">
        <div className="flex gap-1 items-center w-full">
          <Folder size={20} className="text-shark-300" />
          <ChevronRight
            className="opacity-0 -translate-x-[4px] group-hover:translate-x-[4px]
            duration-300 transition-all easy-in-out group-hover:duration-300 group-hover:opacity-100"
            size={18}
          />
          <Typography
            textSize="large"
            className="-translate-x-[20px] font-semibold group-hover:duration-300
            duration-300 transition-all easy-in-out group-hover:translate-x-[4px]"
          >
            {title}
          </Typography>
        </div>
        <div className="flex items-center gap-x-2 w-fit rounded-md px-2 py-1 border-white/10 border-[1px]">
          <div className="flex items-center gap-1 mr-2">
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
          <div className="flex items-center gap-1 ml-2">
            <Plus className="text-puerto-rico-300" size={16} />
            <Typography className="text-shark-300 text-sm font-normal">
              {rating?.increment}
            </Typography>
            <Minus className="text-red-300" size={16} />
          </div>
        </div>
      </div>
      <div className="flex items-center min-w-[260px] gap-x-2">
        <Avatar
          nickname={nickname} propWidth={44} propHeight={44}
          className="min-h-[44px] min-w-[44px]"
        />
        <div className="flex flex-col">
          <UserNickname nickname={nickname} nicknameColor={nicknameColor} />
          <span className="text-shark-300 text-sm">{created_at}</span>
        </div>
      </div>
    </div>
  );
};