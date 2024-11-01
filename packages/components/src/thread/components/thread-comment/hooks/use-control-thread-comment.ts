import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeThreadComment } from '../queries/remove-thread-comment.ts';
import { toast } from 'sonner';
import { THREAD_COMMENTS_QUERY_KEY } from '../../thread-comments/queries/thread-comments-query.ts';
import { ThreadCommentControlType } from '../types/thread-comment-types.ts';
import { EditThreadCommentContent, editThreadCommentContent } from '../queries/edit-thread-comment-content.ts';
import { ThreadComment } from '../../thread-comments/queries/get-thread-comments.ts';

export const useControlThreadComment = () => {
  const qc = useQueryClient();
  
  const editCommentContentMutation = useMutation({
    mutationFn: async(values: EditThreadCommentContent) => editThreadCommentContent(values),
    onSuccess: async(data, variables) => {
      if (!data) return toast.error('Не удалось обновить комментарий');
      
      const prevComments = qc.getQueryData<ThreadComment[]>(
        THREAD_COMMENTS_QUERY_KEY(variables.threadId),
      );
      
      if (!prevComments) {
        return qc.invalidateQueries({
          queryKey: THREAD_COMMENTS_QUERY_KEY(variables.threadId),
        });
      }
      
      const prevCommentIndex = prevComments.findIndex(
        item => item.id === Number(variables.commentId)
      );
      
      if (prevCommentIndex === -1) {
        return qc.invalidateQueries({
          queryKey: THREAD_COMMENTS_QUERY_KEY(variables.threadId),
        });
      }
      
      const prevComment = prevComments[prevCommentIndex];
      
      if (!prevComment) {
        return qc.invalidateQueries({
          queryKey: THREAD_COMMENTS_QUERY_KEY(variables.threadId),
        })
      }
      
      const updatedComments = [...prevComments];
      
      updatedComments[prevCommentIndex] = {
        ...updatedComments[prevCommentIndex],
        content: data.content,
        edited: data.edited
      };
      
      qc.setQueryData(THREAD_COMMENTS_QUERY_KEY(variables.threadId), updatedComments);
    },
    onError: e => { throw new Error(e.message) },
  });
  
  const deleteCommentItemMutation = useMutation({
    mutationFn: async(values: ThreadCommentControlType) => removeThreadComment(values),
    onSuccess: async(data, variables) => {
      if (!data) return toast.error('Произошла ошибка при удалении комментария');
      
      await qc.invalidateQueries({
        queryKey: THREAD_COMMENTS_QUERY_KEY(variables.threadId),
      });
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { editCommentContentMutation, deleteCommentItemMutation };
};