import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../queries/create-post.ts';
import { toast } from 'sonner';
import { POSTS_QUERY_KEY } from '#profile/components/posts/components/posts/queries/posts-query.ts';
import { POST_FORM_FIELD_QUERY_KEY } from '../queries/post-form-query.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

export const useCreatePost = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  
  const createPostMutation = useMutation({
    mutationFn: async({
      content, visibility
    }: Pick<PostEntity, 'content' | 'visibility'>) => createPost({ content, visibility }),
    onSuccess: async(data) => {
      if (!currentUser) return;
      
      if (!data) toast.error('Произошла ошибка при публикации поста. Попробуйте позже!', {
        description: 'Попробуйте попытку позже',
      });
      
      toast.success('Опубликовано')
      
      await Promise.all([
        qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY(currentUser.nickname) }),
        qc.resetQueries({ queryKey: POST_FORM_FIELD_QUERY_KEY }),
      ]);
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { createPostMutation };
};