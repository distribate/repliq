import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export type VisibilityPost = "only" | "all" | "friends";

export type CreatePostFieldType = {
  isActive: boolean;
  visibility: VisibilityPost;
  content: string | null;
};

const initial: CreatePostFieldType = {
  isActive: false,
  content: null,
  visibility: "all",
};

export const POST_FORM_FIELD_QUERY_KEY = createQueryKey("ui", [
  "create-post-field",
]);

export const postFormQuery = () =>
  useQuery<CreatePostFieldType, Error>({
    queryKey: POST_FORM_FIELD_QUERY_KEY,
    staleTime: Infinity,
    initialData: initial,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
