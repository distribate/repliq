'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadCommentItem } from '../../thread-comment/components/thread-comment-item.tsx';
import {
  threadCommentsQuery,
  useUpdateComments,
} from '../queries/thread-comments-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { ThreadOwner } from '@repo/types/entities/thread-type.ts';

type ThreadCommentsProps = {
  thread_id: string,
  owner: ThreadOwner;
  isComments: boolean;
};

type ThreadCommentsHeaderProps = {
  non_comments: boolean;
};

const ThreadCommentsHeader = ({ non_comments }: ThreadCommentsHeaderProps) => {
  return (
    <div className="flex w-fit bg-shark-800 rounded-md px-2 py-0.5">
      {non_comments ? (
        <Typography
          textSize="medium"
          textColor="shark_white"
          className="font-semibold"
        >
          Комментариев еще нет...
        </Typography>
      ) : (
        <Typography
          textSize="medium"
          textColor="shark_white"
          className="font-semibold"
        >
          Обсуждение началось
        </Typography>
      )}
    </div>
  );
};

export const ThreadCommentsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 items-center w-full">
      <Skeleton className="h-8 w-44" />
      <div className="flex flex-col items-start gap-y-2 w-full">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    </div>
  );
};

export const ThreadComments = ({
  thread_id, owner, isComments,
}: ThreadCommentsProps) => {
  const { updateCommentsMutation } = useUpdateComments()
  const { data, isLoading, isFetching } = threadCommentsQuery({ thread_id, isComments });
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  const threadComments = data?.data;
  const threadMeta = data?.meta;
  const nonComments = isComments && !threadComments;
  const hasMore = threadMeta?.hasNextPage;
  const cursor = threadMeta?.endCursor ?? null;

  useEffect(() => {
    if (inView && hasMore && !isFetching) {
      updateCommentsMutation.mutate({ cursor, limit: null, thread_id })
    }
  }, [inView, hasMore]);

  if (isLoading) return <ThreadCommentsSkeleton />;

  return (
    <div className="flex flex-col items-center w-full">
      <ThreadCommentsHeader non_comments={nonComments} />
      {threadComments && (
        <div className="flex flex-col items-start gap-y-2 w-full">
          {threadComments.map((comment, i) => (
            <ThreadCommentItem
              key={i}
              thread_id={thread_id}
              id={comment.id}
              replied={comment.replied}
              edited={comment.is_updated}
              content={comment.content}
              nickname={comment.user_nickname}
              isAuthor={comment.user_nickname === owner.nickname}
              created_at={comment.created_at}
            />
          ))}
          {(hasMore && isFetching) && (
            <div className="flex flex-col items-start gap-y-2 w-full">
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
            </div>
          )}
          {hasMore && <div ref={ref} className="h-[1px] w-full" />}
        </div>
      )}
    </div>
  );
};
