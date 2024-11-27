import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export type PostControlQuery = {
  isEdit: boolean,
  values: {
    content: string | null
  } | null
}

export const POST_CONTROL_QUERY_KEY = (postId: string) => createQueryKey("ui", ["post", "edit"], postId)

const initial: PostControlQuery = {
  isEdit: false,
  values: null
}

export const postControlQuery = (postId: string) => useQuery<
  PostControlQuery, Error
>({
  queryKey: POST_CONTROL_QUERY_KEY(postId),
  initialData: initial,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  gcTime: Infinity,
  staleTime: Infinity
})