import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadCommentActions } from './thread-comment-actions.tsx';
import { ThreadCommentProps } from '../types/thread-comment-types.ts';
import { ThreadRepliedCommentItem } from './thread-comment-replied-item.tsx';
import { useMutationState } from '@tanstack/react-query';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { Badge } from '@repo/ui/src/components/badge.tsx';
import { SELECT_COMMENT_MUTATION_KEY } from '../hooks/use-highlight.ts';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getUser } from '@repo/lib/helpers/get-user.ts';

const ThreadCommentMoreActions = dynamic(() =>
  import("./thread-comment-more-actions.tsx")
  .then(m => m.ThreadCommentMoreActions)
)

export const ThreadCommentItem = ({
  nickname: threadCommentNickname, isAuthor, created_at, content, id, replied, thread_id, edited
}: ThreadCommentProps) => {
  const currentUser = getUser();
  const [active, setActive] = useState<boolean>(false)

  const data = useMutationState({
    filters: { mutationKey: SELECT_COMMENT_MUTATION_KEY(id) },
    select: m => m.state.status,
  })
  
  const mutationStatus = data[data.length - 1]

  useEffect(() => {
    if (mutationStatus === 'success') {
      setActive(true);
      
      const timeoutId = setTimeout(() => setActive(false), 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [mutationStatus]);

  if (!currentUser) return null;
  
  const isCommentOwner = currentUser.nickname === threadCommentNickname;
  const createdAt = dayjs(created_at).fromNow()
  
  return (
    <div
      id={id.toString()}
      className={`${active && 'animate-flash-fade'}
       flex flex-col h-fit gap-y-4 px-4 py-2 rounded-md bg-shark-950 relative min-w-[450px] w-fit max-w-[80%]`}
    >
      {isCommentOwner && (
        <ThreadCommentMoreActions
          id={id}
          thread_id={thread_id}
          content={content}
        />
      )}
      <div className="flex items-center gap-2">
        <Link href={USER_URL + threadCommentNickname}>
          <Avatar
            nickname={threadCommentNickname}
            propWidth={42}
            propHeight={42}
            className="min-h-[42px] min-w-[42px]"
          />
        </Link>
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <UserNickname nickname={threadCommentNickname} />
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
        {replied && <ThreadRepliedCommentItem replied={replied}/>}
        <div className="whitespace-normal break-words">
          <Typography className="text-balance">{content}</Typography>
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <ThreadCommentActions
          id={thread_id}
          isCommentOwner={isCommentOwner}
          commentId={id}
          commentNickname={threadCommentNickname}
          commentContent={content}
        />
        {edited && (
          <Typography textColor="gray" textSize="small">
            [изменено]
          </Typography>
        )}
      </div>
    </div>
  );
};