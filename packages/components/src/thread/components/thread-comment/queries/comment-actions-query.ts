import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const COMMENT_ACTIONS_QUERY_KEY = (commentId: number) =>
  createQueryKey('ui', [ 'comment-actions' ], commentId);

export type CommentActionsQuery = {
  isEdit: boolean
}

const initial: CommentActionsQuery = {
  isEdit: false,
};

export const commentActionsQuery = (commentId: number | null) => {
  if (!commentId) return null;
  
  return useQuery<CommentActionsQuery, Error>({
    queryKey: COMMENT_ACTIONS_QUERY_KEY(commentId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    initialData: initial,
    retry: 1,
    refetchOnMount: false,
    enabled: !!commentId,
  });
};