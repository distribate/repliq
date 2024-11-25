import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CREATE_THREAD_COMMENT_QUERY_KEY,
  CreateThreadCommentQuery, initialThreadCommentData,
} from '../queries/create-thread-comment-query.ts';
import { postThreadComment } from '../queries/post-thread-comment.ts';
import { toast } from 'sonner';
import { THREAD_COMMENTS_QUERY_KEY } from '#thread/components/thread-comments/queries/thread-comments-query.ts';

export const useCreateThreadComment = () => {
  const qc = useQueryClient();

  const updateCreateThreadCommentMutation = useMutation({
    mutationFn: async(input: CreateThreadCommentQuery) => {
      const { content, formState, repliedValues, type, threadId } = input;
      
      return qc.setQueryData(CREATE_THREAD_COMMENT_QUERY_KEY, (prev: CreateThreadCommentQuery) => ({
        ...prev,
        threadId: threadId ?? prev.threadId,
        type: type ?? prev.type,
        content: content ? content.length >= 1 ? content : null : null,
        formState: { ...prev.formState, ...formState },
        repliedValues: { ...prev.repliedValues, ...repliedValues },
      }));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CREATE_THREAD_COMMENT_QUERY_KEY }),
    onError: e => {throw new Error(e.message)},
  });
  
  const createThreadCommentMutation = useMutation({
    mutationFn: async() => {
      const threadComment = qc.getQueryData<CreateThreadCommentQuery>(CREATE_THREAD_COMMENT_QUERY_KEY,);
      if (!threadComment) return
      
      const thread_id = threadComment.threadId;
      const content = threadComment.content;
      const type = threadComment.type || 'single';
      const recipient_comment_id = threadComment?.repliedValues?.commentId;
      
      if (!thread_id || !content) return

      const threadCommentId = await postThreadComment({
        thread_id, content, recipient_comment_id, type
      });
      
      return { threadCommentId, thread_id };
    },
    onSuccess: async(data) => {
      if (!data) return toast.error('Что-то пошло не так!');
      
      await qc.invalidateQueries({ queryKey: THREAD_COMMENTS_QUERY_KEY(data.thread_id) });
      
      const defaultValues: CreateThreadCommentQuery = {
        ...initialThreadCommentData,
        threadId: data.thread_id
      }
      
      qc.setQueryData(CREATE_THREAD_COMMENT_QUERY_KEY, () => defaultValues);
    },
    onError: e => {throw new Error(e.message)},
  });
  
  return { updateCreateThreadCommentMutation, createThreadCommentMutation };
};