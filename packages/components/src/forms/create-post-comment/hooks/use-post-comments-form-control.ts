import { useMutation, useQueryClient } from '@tanstack/react-query';
import { POST_COMMENT_FIELD_QUERY_KEY, PostCommentField } from '../queries/post-comment-field-query.ts';
import { postComment } from '../queries/create-comment.ts';
import { toast } from 'sonner';
import {
  POST_COMMENTS_QUERY_KEY,
} from '#profile/components/posts/components/posts/queries/posts-comments-query.ts';

export const usePostCommentsFormControl = () => {
  const qc = useQueryClient();
  
  const updatePostCommentFieldMutation = useMutation({
    mutationFn: async(values: PostCommentField) => {
      if (!values.post_id) return;
      
      return qc.setQueryData(
        POST_COMMENT_FIELD_QUERY_KEY(values.post_id),
        (prev: PostCommentField) => ({ ...prev, ...values }),
      );
    },
    onSuccess: (data, variables) => {
      if (!variables || !variables.post_id) return;
      
      return qc.invalidateQueries({
        queryKey: POST_COMMENT_FIELD_QUERY_KEY(variables.post_id),
      });
    },
    onError: e => { throw new Error(e.message); },
  });
  
  const createPostCommentMutation = useMutation({
    mutationFn: async(post_id: string) => {
      const formField = qc.getQueryData<PostCommentField>(
        POST_COMMENT_FIELD_QUERY_KEY(post_id),
      );
      
      if (!formField || !formField.content) {
        return toast.error('Что-то пошло не так!');
      }
      
      return postComment({
        post_id, content: formField.content,
      });
    },
    onSuccess: async(data, variables) => {
      if (!data || !variables) {
        return toast.error('Произошла ошибка при создании комментария');
      }
      
      await Promise.all([
        qc.refetchQueries({ queryKey: POST_COMMENTS_QUERY_KEY(variables) }),
        qc.resetQueries({ queryKey: POST_COMMENT_FIELD_QUERY_KEY(variables) }),
      ]);
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { updatePostCommentFieldMutation, createPostCommentMutation };
};