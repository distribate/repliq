import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import { Avatar } from '../../../../user/components/avatar/components/avatar.tsx';
import { UserNickname } from '../../../../user/components/name/components/nickname.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadCommentActions } from './thread-comment-actions.tsx';
import { ThreadCommentProps } from '../types/thread-comment-types.ts';
import { ThreadRepliedCommentItem } from './thread-comment-replied-item.tsx';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import dynamic from 'next/dynamic';
import { Badge } from '@repo/ui/src/components/badge.tsx';

const ThreadCommentMoreActions = dynamic(() =>
  import("./thread-comment-more-actions.tsx")
  .then(m => m.ThreadCommentMoreActions)
)

export const ThreadCommentItem = ({
  nickname, isAuthor, created_at, content,
  id, replied, thread_id,
}: ThreadCommentProps) => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  if (!currentUser) return null;
  
  const isCommentOwner = currentUser.nickname === nickname;
  const createdAt = dayjs(created_at).fromNow()
  
  return (
    <div
      id={id}
      className="flex flex-col h-fit gap-y-4 px-4 py-2 rounded-md bg-shark-950 relative min-w-[450px] w-fit max-w-[80%]"
    >
      {isCommentOwner && <ThreadCommentMoreActions />}
      <div className="flex items-center gap-2">
        <Link href={USER_URL + nickname}>
          <Avatar
            nickname={nickname}
            propWidth={42}
            propHeight={42}
            className="min-h-[42px] min-w-[42px]"
          />
        </Link>
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <UserNickname nickname={nickname} />
              {isAuthor && (
                <Badge size="small">
                  <Typography className="font-[Minecraft] leading-4">
                    автор
                  </Typography>
                </Badge>
              )}
            </div>
            <Typography className="text-shark-300 text-sm">{createdAt}</Typography>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 h-fit w-full">
        {replied && <ThreadRepliedCommentItem replied={replied} />}
        <div className="whitespace-normal break-words">
          <Typography className="text-balance">{content}</Typography>
        </div>
      </div>
      <ThreadCommentActions
        thread_id={thread_id}
        comment_id={id}
        comment_nickname={nickname}
        comment_content={content}
      />
    </div>
  );
};