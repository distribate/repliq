import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';
import { forumPostClient } from '@repo/shared/api/forum-client';

export type PostViewsQuery = Pick<PostEntity, 'id'> & {
  enabled: boolean;
};

export const POST_VIEWS_QUERY_KEY = (postId: string) =>
  createQueryKey('ui', [ 'post', 'views' ], postId);

async function getPostViews(id: string) {
  const res = await forumPostClient.post["get-post-viewers"][":id"].$get({
    param: { id }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data.data
}

export const postViewsQuery = ({ id: postId, enabled }: PostViewsQuery) => useQuery({
  queryKey: POST_VIEWS_QUERY_KEY(postId),
  queryFn: () => getPostViews(postId),
  enabled,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
});