import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePost } from '../queries/remove-post.ts';
import {
  POSTS_QUERY_KEY,
  PostsQueryPromise,
} from '#profile/components/posts/components/posts/queries/posts-query.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';
import { toast } from 'sonner';
import { editPost } from '#post/components/post-item/queries/edit-post.ts';
import { disablePostComments } from '#post/components/post-item/queries/disable-post-comments.ts';
import { pinPost } from '#post/components/post-item/queries/pin-post.ts';
import { getUpdatedPost } from '#post/components/post-item/queries/get-updated-post.ts';
import { POST_CONTROL_QUERY_KEY, PostControlQuery } from '#post/components/post-item/queries/post-control-query.ts';

type ControlPostActionType = 'remove' | 'edit' | 'pin' | 'comments'

type ControlPost = {
  nickname: string
  id: PostEntity['id']
  type: ControlPostActionType
}

export const useControlPost = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  
  const controlPostMutation = useMutation({
    mutationFn: async(values: ControlPost) => {
      const { id, type, nickname } = values;
      
      const posts = qc.getQueryData<PostsQueryPromise>(POSTS_QUERY_KEY(nickname))?.data;
      if (!posts) return;
      
      let post = posts.find(post => post.id === id);
      if (!post) return;
      
      const { isPinned, isComments, content: prevContent } = post;
      const content = qc.getQueryData<PostControlQuery>(POST_CONTROL_QUERY_KEY(id))?.values?.content;
      
      switch(type) {
        case 'pin':
          return pinPost({ id, isPinned });
        case 'comments':
          return disablePostComments({ id, isComments });
        case 'remove':
          return removePost({ id });
        case 'edit':
          return editPost({ id, content: content ?? prevContent });
        default:
          break;
      }
    },
    onSuccess: async(data, variables) => {
      if (!data || !currentUser) return toast.error('Произошла ошибка');
      
      if (variables.type === 'remove') {
        return qc.setQueryData(
          POSTS_QUERY_KEY(currentUser.nickname),
          (prev: PostsQueryPromise) => {
            if (!prev.data) return null;
            
            const newData = prev.data.filter(post => post.id !== variables.id)
            
            return {
              data: newData,
              meta: {
                count: newData.length ?? 0
              }
            }
          },
        );
      }
      
      const updatedPost = await getUpdatedPost({
        nickname: variables.nickname,
        id: variables.id,
      });
      
      if (!updatedPost) return qc.invalidateQueries({
        queryKey: POSTS_QUERY_KEY(currentUser.nickname),
      });
      
      qc.setQueryData(POSTS_QUERY_KEY(currentUser.nickname), (prev: PostsQueryPromise) => {
        if (!prev.data) return prev;
        
        return {
          ...prev,
          data: prev.data.map(post =>
            post.id === updatedPost.id ? updatedPost : post,
          ),
        };
      });
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { controlPostMutation };
};