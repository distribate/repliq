import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePost } from '../queries/remove-post.ts';
import { POSTS_QUERY_KEY } from '#profile/components/posts/components/posts/queries/posts-query.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';
import { toast } from 'sonner';
import { editPost } from '#post/components/post-item/queries/edit-post.ts';
import { disablePostComments } from '#post/components/post-item/queries/disable-post-comments.ts';
import { pinPost } from '#post/components/post-item/queries/pin-post.ts';

type ControlPost =
  | { type: 'remove'; id: PostEntity['id'] }
  | { type: 'edit'; id: PostEntity['id']; content: string }
  | { type: 'pin'; id: PostEntity['id']; isPinned: boolean }
  | { type: 'comments'; id: PostEntity['id']; isComments: boolean };

export const useControlPost = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  
  const controlPostMutation = useMutation({
    mutationFn: async(values: ControlPost) => {
      const { id, type } = values;
      
      if (type === 'remove') {
        return removePost({ id });
      } else if (type === 'edit') {
        const { content } = values;
        return editPost({ id, content });
      } else if (type === 'comments') {
        const { isComments } = values;
        return disablePostComments({ id, isComments });
      } else if (type === 'pin') {
        const { isPinned } = values;
        return pinPost({ id, isPinned });
      }
    },
    onSuccess: async(data) => {
      console.log(data)
      if (!data || !currentUser) return toast.error('Произошла ошибка');
      
      return qc.invalidateQueries({
        queryKey: POSTS_QUERY_KEY(currentUser.nickname),
      });
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { controlPostMutation };
};