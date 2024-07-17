'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadCommentItem } from '../../thread-comment/components/thread-comment-item.tsx';
import { ThreadCommentsSkeleton } from './thread-comments-skeleton.tsx';
import { CreateThreadComment } from '../../create-thread-comment/components/create-thread-comment.tsx';
import { CommentsDisabled } from '../../../../templates/comments-disabled.tsx';
import { threadCommentsQuery } from '../queries/thread-comments-query.ts';

type ThreadCommentsProps = {
  thread_id: string,
  thread_author_nickname: string,
  thread_comments: boolean
}

export const ThreadComments = ({
  thread_id, thread_author_nickname, thread_comments,
}: ThreadCommentsProps) => {
  const { data: threadComments, isLoading } = threadCommentsQuery(
    thread_id, thread_comments,
  );
  
  const nonComments = thread_comments && !threadComments?.length || false;
  
  if (!thread_comments) return <CommentsDisabled />;
  
  return (
    <div className="flex flex-col min-w-[75%] w-fit gap-y-4">
      <div className="flex flex-col justify-center items-center w-full">
        <div className={`flex w-fit bg-white/10 rounded-md px-2 py-0.5 ${!nonComments && 'mb-2'}`}>
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
        <div className="flex flex-col items-start gap-y-2 w-full">
          {isLoading ? (
            <ThreadCommentsSkeleton />
          ) : (
            threadComments?.map((comment, i) => (
              <ThreadCommentItem
                key={i}
                thread_id={thread_id}
                id={comment.id}
                replied={comment.replied}
                content={comment.content}
                nickname={comment.user_nickname}
                isAuthor={comment.user_nickname === thread_author_nickname}
                created_at={comment.created_at}
              />
            ))
          )}
        </div>
      </div>
      <CreateThreadComment thread_id={thread_id} />
    </div>
  );
};