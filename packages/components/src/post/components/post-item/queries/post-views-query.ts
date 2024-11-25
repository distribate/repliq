import { useQuery } from '@tanstack/react-query';
import { getPostViewsUsers } from '#post/components/post-item/queries/post-views-list.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export type PostViewsQuery = {
  postId: string,
  enabled: boolean
}

export const POST_VIEWS_QUERY_KEY = (postId: string) => createQueryKey("ui", ["post", "views"], postId)

export const postViewsQuery = ({
  postId, enabled
}: PostViewsQuery) => useQuery({
  queryKey: POST_VIEWS_QUERY_KEY(postId),
  queryFn: () => getPostViewsUsers(postId),
  retry: 1,
  enabled
});