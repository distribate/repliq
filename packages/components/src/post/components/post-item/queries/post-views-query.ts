import { useQuery } from '@tanstack/react-query';
import { getPostViewsUsers } from '#post/components/post-item/queries/post-views-list.ts';

export type PostViewsQuery = {
  postId: string,
  enabled: boolean
}

export const POST_VIEWS_QUERY_KEY = (postId: Pick<PostViewsQuery, 'postId'>['postId']) =>
  [ 'post', 'views', postId ];

export const postViewsQuery = ({
  postId, enabled,
}: PostViewsQuery) => useQuery({
  queryKey: POST_VIEWS_QUERY_KEY(postId),
  queryFn: () => getPostViewsUsers(postId),
  retry: 1,
  enabled: enabled,
});