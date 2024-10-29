import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePost } from '../queries/remove-post.ts';
import { POSTS_QUERY_KEY } from '../../../../profile/components/posts/components/posts/queries/posts-query.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';

type ControlPostType = 'remove'
  | 'edit'
  | 'dialog'
  | 'comments'
  | 'pin'

type ControlPost = {
  type: ControlPostType,
  post_id: string,
  nickname: string
}

export const useControlPost = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  
  const controlPostMutation = useMutation({
    mutationFn: async(values: ControlPost) => {
      if (!values) return;
      
      switch(values.type) {
        case 'remove':
          return removePost({
            post_id: values.post_id, nickname: values.nickname,
          });
	      case 'edit':
					
	      case 'dialog':
		   
      }
    },
    onSuccess: async(data, variables, context) => {
			if (!variables || !currentUser) return;
			
			if (variables.type === 'remove') {
				await qc.invalidateQueries({ queryKey: POSTS_QUERY_KEY(currentUser.nickname)})
			}
    },
    onError: (e) => { throw new Error(e.message) },
  });
  
  return { controlPostMutation };
};