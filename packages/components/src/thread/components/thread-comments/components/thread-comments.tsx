'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadCommentItem } from '../../thread-comment/components/thread-comment-item.tsx';
import { ThreadCommentsSkeleton } from './thread-comments-skeleton.tsx';
import { CommentsDisabled } from '#templates/comments-disabled.tsx';
import { threadCommentsQuery } from '../queries/thread-comments-query.ts';

type ThreadCommentsProps = {
  threadId: string,
  threadAuthorNickname: string,
  comments: boolean
}

export const ThreadComments = ({
  threadId, threadAuthorNickname, comments,
}: ThreadCommentsProps) => {
  const { data: threadComments, isLoading } = threadCommentsQuery({ threadId, comments });
  
  if (!threadComments) return;
  if (!comments) return <CommentsDisabled />;
  
  const nonComments = comments && threadComments.length === 0
  
  return (
    <div className="flex flex-col items-center w-full">
      <div className={`flex w-fit bg-shark-700 rounded-md px-2 py-0.5 ${!nonComments && 'mb-2'}`}>
        {nonComments ? (
          <Typography textSize="medium" textColor="shark_white" className="font-semibold">
            Комментариев еще нет...
          </Typography>
        ) : (
          <Typography textSize="medium" textColor="shark_white" className="font-semibold">
            Обсуждение началось
          </Typography>
        )}
      </div>
      {isLoading ? <ThreadCommentsSkeleton /> : (
        <div className="flex flex-col items-start gap-y-2 w-full">
          {threadComments.map((comment, i) => (
            <ThreadCommentItem
              key={i}
              thread_id={threadId}
              id={comment.id}
              replied={comment.replied}
              edited={comment.edited}
              content={comment.content}
              nickname={comment.user_nickname}
              isAuthor={comment.user_nickname === threadAuthorNickname}
              created_at={comment.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
};