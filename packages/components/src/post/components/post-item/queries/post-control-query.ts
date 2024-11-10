import { useQuery } from '@tanstack/react-query';

export type PostControlQuery = {
  isEdit: boolean
}

export const POST_CONTROL_QUERY_KEY = (postId: string) => ["post", "edit", postId]

export const postControlQuery = (postId: string) => useQuery<
  PostControlQuery, Error
>({
  queryKey: POST_CONTROL_QUERY_KEY(postId),
  initialData: {
    isEdit: false
  },
  refetchOnWindowFocus: false,
  gcTime: Infinity,
  staleTime: Infinity
})