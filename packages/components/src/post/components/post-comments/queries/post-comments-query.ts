import { useQuery } from '@tanstack/react-query';
import { GetPostsComments, getPostsComments } from '#post/components/post-comments/queries/get-posts-comments.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const POST_COMMENTS_QUERY_KEY = (post_id: string) => createQueryKey('ui', [ 'post', 'comments' ], post_id);

type PostCommentsQuery = GetPostsComments & {
  comments: boolean
}

export const postCommentsQuery = ({
  id, comments = true, range, limit, order, ascending,
}: PostCommentsQuery) => useQuery({
  queryKey: POST_COMMENTS_QUERY_KEY(id),
  queryFn: () => getPostsComments({ id, limit, order, range, ascending, }),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  enabled: comments && !!id,
});