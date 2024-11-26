import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RemovePostComment, removePostComment } from '../queries/remove-post-comment.ts';
import { toast } from 'sonner';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { POST_COMMENTS_QUERY_KEY } from '#post/components/post-comments/queries/post-comments-query.ts';

type ControlCommentType = 'remove' | 'edit';

type ControlComment = RemovePostComment & {
  type: ControlCommentType,
  post_id: string
}

export const useControlComment = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  
  const controlCommentMutation = useMutation({
    mutationFn: async(values: ControlComment) => {
      if (!values || !currentUser) return;
     
      // switch(values.type) {
      //   case 'remove':
      //     return removePostComment({ id: values.id });
      //   case 'edit':
      //
      // }
    },
    // onSuccess: async(data, variables) => {
    //   if (!data || !variables) return toast.error('Произошла ошибка');
    //
    //   return qc.invalidateQueries({
    //     queryKey: POST_COMMENTS_QUERY_KEY(variables.post_id),
    //   });
    // },
    onError: e => { throw new Error(e.message) },
  });
  
  return { controlCommentMutation };
};