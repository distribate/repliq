import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePostComment } from '../queries/remove-post-comment.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { POST_COMMENTS_QUERY_KEY, } from '../../../../profile/components/posts/components/posts/queries/posts-comments-query.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';

type ControlCommentType = 'remove' | 'edit';

type ControlComment = {
  type: ControlCommentType,
  comment_id: string,
  post_id: string
}

export const useControlComment = () => {
  const qc = useQueryClient();
  const { data: currentUser } = currentUserQuery();
  
  const controlCommentMutation = useMutation({
    mutationFn: async(values: ControlComment) => {
      if (!values || !currentUser) return;
      
      switch(values.type) {
        case 'remove':
          return removePostComment({
            comment_id: values.comment_id, nickname: currentUser.nickname,
          });
        case 'edit':
        
      }
    },
    onSuccess: async(data, variables) => {
      if (!data || !variables) {
        toast({
          title: 'Произошла ошибка', variant: 'negative',
        });
      }
      
      await qc.invalidateQueries({
        queryKey: POST_COMMENTS_QUERY_KEY(variables.post_id),
      });
    },
    onError: (e) => { throw new Error(e.message) },
  });
  
  return { controlCommentMutation };
};