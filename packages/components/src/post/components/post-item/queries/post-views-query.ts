import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPostViewsUsers } from '#post/components/post-item/queries/post-views-list.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

export type PostViewsQuery = Pick<PostEntity, "id"> & {
  enabled: boolean
}

export const POST_VIEWS_QUERY_KEY = (postId: string) =>
  createQueryKey("ui", ["post", "views"], postId)

export const postViewsQuery = ({
  id: postId, enabled
}: PostViewsQuery) => useQuery({
  queryKey: POST_VIEWS_QUERY_KEY(postId),
  queryFn: () => getPostViewsUsers(postId),
  retry: 1,
  enabled,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData
});