import { useQuery } from '@tanstack/react-query';
import { getPostsComments, PostComments } from './get-posts-comments.ts';

export const POST_COMMENTS_QUERY_KEY = (post_id: string) => {
  return ["ui", "post", "comments", post_id]
}

export const postCommentsQuery = ({
  post_id, comments
}: PostComments & {
  comments: boolean
}) => {
  return useQuery({
    queryKey: POST_COMMENTS_QUERY_KEY(post_id),
    queryFn: () => getPostsComments({ post_id }),
    enabled: comments && !!post_id
  })
}