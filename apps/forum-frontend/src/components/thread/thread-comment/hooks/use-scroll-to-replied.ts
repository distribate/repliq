import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useHighlight } from './use-highlight';
import { THREAD_COMMENTS_QUERY_KEY } from '#components/thread/thread-comments/queries/thread-comments-query';
import { GetThreadCommentsResponse } from '@repo/types/entities/thread-comments-types';
import { useUpdateComments } from '#components/thread/thread-comments/hooks/use-update-comments';
import { ThreadDetailed } from '@repo/types/entities/thread-type';
import { THREAD_QUERY_KEY } from '#components/thread/thread-main/queries/thread-query';

interface UseScrollToCommentProps {
  threadId: string;
  repliedId: number;
}

export const useScrollToComment = ({ 
  threadId, repliedId 
}: UseScrollToCommentProps) => {
  const qc = useQueryClient();
  const { selectItem } = useHighlight(repliedId);
  const { updateCommentsMutation } = useUpdateComments();

  const scrollToComment = useCallback(async () => {
    const comments = qc.getQueryData<GetThreadCommentsResponse>(
      THREAD_COMMENTS_QUERY_KEY(threadId)
    )?.data;

    const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId));

    if (!comments || !thread) return;

    const totalThreadCommentsLength = thread.comments_count;
    let loadedComments = [...comments];

    let commentIndex = loadedComments.findIndex(comment => comment.id === repliedId);

    while (commentIndex === -1 && loadedComments.length < totalThreadCommentsLength) {
      const currentCursor = qc.getQueryData<GetThreadCommentsResponse>(
        THREAD_COMMENTS_QUERY_KEY(threadId)
      )?.meta.endCursor;

      if (!currentCursor) break;

      try {
        const newComments = await updateCommentsMutation.mutateAsync({
          cursor: currentCursor,
          threadId,
        });

        if (newComments?.data) {
          loadedComments = [...loadedComments, ...newComments.data];
        }

        commentIndex = loadedComments.findIndex(comment => comment.id === repliedId);
      } catch (error) {
        break;
      }
    }

    if (commentIndex === -1) {
      return;
    }

    setTimeout(() => {
      const id = (commentIndex + 1).toString();
      const repliedElement = document.getElementById(id);

      selectItem();

      if (repliedElement) {
        repliedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }, [qc, threadId, repliedId, selectItem, updateCommentsMutation]);

  return { scrollToComment };
};