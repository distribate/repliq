import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePost } from '../queries/remove-post.ts';
import { POSTS_QUERY_KEY } from '#profile/components/posts/components/posts/queries/posts-query.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

type ControlPostType = 'remove' | 'edit' | 'comments' | 'pin'

type ControlPost = Pick<PostEntity, "id"> & {
  type: ControlPostType,
  nickname: string
}

export const useControlPost = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  
  const controlPostMutation = useMutation({
    mutationFn: async(values: ControlPost) => {
      if (!values) return;
      
      switch(values.type) {
        case 'remove':
          return removePost({
            id: values.id, nickname: values.nickname,
          });
	      case 'edit':
       
      }
    },
    onSuccess: async(data, variables, context) => {
			if (!variables || !currentUser) return;
			
			if (variables.type === 'remove') {
				return qc.invalidateQueries({
          queryKey: POSTS_QUERY_KEY(currentUser.nickname)
        })
			}
    },
    onError: e => { throw new Error(e.message) },
  });
  
  return { controlPostMutation };
};