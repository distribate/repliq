import { useSuspenseQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export type PostControlQuery = {
  isEdit: boolean;
  content: string | null
};

export const POST_CONTROL_QUERY_KEY = (postId: string) => createQueryKey("ui", ["post", "edit"], postId);

const initial: PostControlQuery = {
  isEdit: false,
  content: null
};

export const postControlQuery = (postId: string) => useSuspenseQuery<PostControlQuery, Error>({
  queryKey: POST_CONTROL_QUERY_KEY(postId),
  initialData: initial,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  gcTime: Infinity,
  staleTime: Infinity,
});