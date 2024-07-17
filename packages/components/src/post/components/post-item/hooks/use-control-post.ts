import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePost } from '../queries/remove-post.ts';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { POSTS_QUERY_KEY } from '../../../../profile/components/posts/components/posts/queries/posts-query.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';

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
	const { setDialogIdMutation } = useDialog()
	
	const { data: currentUser } = currentUserQuery()
	
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
		      setDialogIdMutation.mutate({
			      dialogName: `post-dialog-${values.post_id}`
		      })
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