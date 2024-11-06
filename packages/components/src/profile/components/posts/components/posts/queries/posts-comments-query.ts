import { useQuery } from '@tanstack/react-query';
import { GetPostsComments, getPostsComments } from './get-posts-comments.ts';

export const POST_COMMENTS_QUERY_KEY = (post_id: string) =>
  [ 'ui', 'post', 'comments', post_id ];

type PostsCommentsQuery = GetPostsComments & {
  comments: boolean
}

export const postCommentsQuery = ({
  id, comments, range, limit, order, ascending
}: PostsCommentsQuery) => {
  return useQuery({
    queryKey: POST_COMMENTS_QUERY_KEY(id),
    queryFn: () => getPostsComments({
      id, limit, order, range, ascending
    }),
    refetchOnWindowFocus: false,
    enabled: comments && !!id,
  });
};