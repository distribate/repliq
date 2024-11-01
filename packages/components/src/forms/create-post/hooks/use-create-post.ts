import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, createPostReferenced, Post } from '../queries/create-post.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { toast } from 'sonner';
import { POSTS_QUERY_KEY } from '../../../profile/components/posts/components/posts/queries/posts-query.ts';
import { POST_FORM_FIELD_QUERY_KEY } from '../queries/post-form-query.ts';

export const CREATE_POST_MUTATION_QUERY_KEY = [ 'ui', 'create-post-field-mn' ];

export const useCreatePost = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const createPostMutation = useMutation({
    mutationKey: CREATE_POST_MUTATION_QUERY_KEY,
    mutationFn: async({ content, visibility }: Post) => {
      if (!currentUser) return;
      
      const { post_id } = await createPostReferenced({
        visibility: visibility, content: content,
      });
      
      if (post_id) {
        const isSuccess = await createPost({
          post_id: post_id, user_nickname: currentUser.nickname,
        });
        
        if (!isSuccess) return toast.error('Произошла ошибка при публикации поста. Попробуйте позже!', {
          description: 'Попробуйте попытку позже',
        });
        
        return toast.success('Опубликовано');
      }
    },
    onSuccess: async() => {
      if (currentUser) {
        await Promise.all([
          qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY(currentUser.nickname) }),
          qc.resetQueries({ queryKey: POST_FORM_FIELD_QUERY_KEY }),
        ]);
      }
    },
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { createPostMutation };
};