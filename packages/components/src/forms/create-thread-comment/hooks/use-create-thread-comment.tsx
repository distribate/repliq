import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CREATE_THREAD_COMMENT_QUERY_KEY,
  CreateThreadCommentQuery, initialThreadCommentData,
} from '../queries/create-thread-comment-query.ts';
import { postThreadComment } from '../queries/post-thread-comment.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { toast } from 'sonner';
import { THREAD_COMMENTS_QUERY_KEY } from '../../../thread/components/thread-comments/queries/thread-comments-query.ts';

export const useCreateThreadComment = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const updateCreateThreadCommentMutation = useMutation({
    mutationFn: async({
      values, formState, repliedValues, type, threadId,
    }: CreateThreadCommentQuery) => {
      return qc.setQueryData(CREATE_THREAD_COMMENT_QUERY_KEY, (prev: CreateThreadCommentQuery) => ({
        ...prev,
        threadId: threadId || prev.threadId,
        type: type || prev.type,
        values: { ...prev.values, ...values },
        formState: { ...prev.formState, ...formState },
        repliedValues: { ...prev.repliedValues, ...repliedValues },
      }));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CREATE_THREAD_COMMENT_QUERY_KEY }),
    onError: (e) => {throw new Error(e.message);},
  });
  
  const createThreadCommentMutation = useMutation({
    mutationFn: async() => {
      if (!currentUser) return;
      
      const threadComment = qc.getQueryData<CreateThreadCommentQuery>(
        CREATE_THREAD_COMMENT_QUERY_KEY,
      );
      
      const threadId = threadComment?.threadId;
      
      if (!threadId) {
        toast.error("Что-то пошло не так!", {
          description: "Перезагрузите страницу!"
        })
        
        return;
      }
      
      const values = threadComment?.values;
      const content = values?.content;
      const type = threadComment?.type || 'single';
      const recipient = threadComment?.repliedValues?.commentId;
      
      if (!content || !threadId) return;
      
      const threadCommentId = await postThreadComment({
        thread_id: threadId,
        user_nickname: currentUser.nickname,
        content,
        recipient_comment_id: recipient,
        type
      });
      
      return { threadCommentId, threadId };
    },
    onSuccess: async(data) => {
      if (!data) return toast.error('Что-то пошло не так!');
      
      await qc.invalidateQueries({ queryKey: THREAD_COMMENTS_QUERY_KEY(data.threadId) });
      
      const defaultValues: CreateThreadCommentQuery = {
        ...initialThreadCommentData,
        threadId: data.threadId
      }
      
      qc.setQueryData(CREATE_THREAD_COMMENT_QUERY_KEY, () => defaultValues);
    },
    onError: (e) => {throw new Error(e.message);},
  });
  
  return { updateCreateThreadCommentMutation, createThreadCommentMutation };
};