'use client';

import { ThreadCommentItem } from '../../thread-comment/components/thread-comment-item.tsx';
import {
  threadCommentsQuery
} from '../queries/thread-comments-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { ThreadDetailed } from '@repo/types/entities/thread-type.ts';
import { UPDATE_COMMENTS_MUTATION_KEY, useUpdateComments } from '../hooks/use-update-comments.ts';
import { ThreadCommentsSkeleton } from './thread-comments-skeleton.tsx';
import { ThreadCommentsHeader } from './thread-comments-header.tsx';
import { useMutationState } from '@tanstack/react-query';

type ThreadCommentsProps = Pick<ThreadDetailed, 'id' | "is_comments" | "owner">

export const ThreadComments = ({
  id: thread_id, owner, is_comments,
}: ThreadCommentsProps) => {
  const { updateCommentsMutation } = useUpdateComments()
  const { data, isLoading } = threadCommentsQuery({ id: thread_id, is_comments });
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  const mutData = useMutationState({
    filters: { mutationKey: UPDATE_COMMENTS_MUTATION_KEY },
    select: (m) => m.state.status
  })

  const isLoadingUpdated = mutData[mutData.length - 1] === "pending";

  const threadComments = data?.data;
  const threadMeta = data?.meta;
  const nonComments = is_comments && !threadComments;
  const hasMore = threadMeta?.hasNextPage;
  const cursor = threadMeta?.endCursor ?? undefined;

  useEffect(() => {
    if (inView && hasMore) {
      updateCommentsMutation.mutate({ cursor, threadId: thread_id });
    }
  }, [inView, hasMore]);

  if (isLoading) return <ThreadCommentsSkeleton />;

  return (
    <div className="flex flex-col items-center relative w-full">
      {threadComments && (
        <div className="flex flex-col items-start gap-y-2 w-full">
          {threadComments.map((comment, i) => (
            <ThreadCommentItem
              key={i}
              idx={i + 1} // index for comment's id
              thread_id={thread_id}
              id={comment.id}
              replied={comment.replied}
              is_updated={comment.is_updated}
              content={comment.content}
              user_nickname={comment.user_nickname}
              is_owner={comment.user_nickname === owner.nickname}
              created_at={comment.created_at}
              updated_at={comment.updated_at}
            />
          ))}
          {(isLoadingUpdated) && (
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
