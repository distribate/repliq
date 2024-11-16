'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadCommentItem } from '../../thread-comment/components/thread-comment-item.tsx';
import { threadCommentsQuery } from '../queries/thread-comments-query.ts';
import { ThreadCommentEntity } from '@repo/types/entities/entities-type.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

type ThreadCommentsProps = Pick<ThreadCommentEntity, 'thread_id'> & {
  threadAuthorNickname: string,
  isComments: boolean
}

const skeletonArray = Array.from({ length: 3 });

const ThreadCommentsSkeleton = () => {
  return (
    <div className="flex flex-col items-start gap-y-2 w-full">
      {skeletonArray.map((_, i) => (
        <Skeleton key={i} className="h-[80px] w-full" />
      ))}
    </div>
  )
}

export const ThreadComments = ({
  thread_id, threadAuthorNickname, isComments,
}: ThreadCommentsProps) => {
  const { data: threadComments, isLoading } = threadCommentsQuery({ thread_id, isComments });
  
  if (!threadComments) return null;
  
  const nonComments = isComments && threadComments.length === 0;
  
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
              thread_id={thread_id}
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