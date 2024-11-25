import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const CREATE_THREAD_COMMENT_QUERY_KEY = createQueryKey("ui", ['create-thread-comment'])

export type CreateThreadCommentType = 'single' | 'reply'

export type RepliedValuesType = {
  commentId: number,
  commentNickname: string,
  commentContent: string
}

export type CreateThreadCommentQuery = Partial<{
  threadId: string
  type: CreateThreadCommentType,
  repliedValues: RepliedValuesType | null,
  content: string | null,
  formState: { active: boolean },
}>

export const initialThreadCommentData: CreateThreadCommentQuery = {
  type: 'single',
  formState: { active: false },
  content: null,
  repliedValues: null,
};

export const createThreadCommentQuery = () => useQuery<CreateThreadCommentQuery, Error>({
  queryKey: CREATE_THREAD_COMMENT_QUERY_KEY,
  staleTime: Infinity,
  gcTime: Infinity,
  initialData: initialThreadCommentData,
  refetchOnMount: true
});