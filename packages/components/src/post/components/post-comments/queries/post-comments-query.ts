import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { PostEntity } from "@repo/types/entities/entities-type";

export const POST_COMMENTS_QUERY_KEY = (post_id: string) =>
  createQueryKey("ui", ["post", "comments"], post_id);

type GetPostsComments = Pick<PostEntity, "id"> &
  Partial<{
    order: "created_at" | "rating";
    limit: number;
    range: number[];
    ascending: boolean;
  }>;

type PostCommentsQuery = GetPostsComments & {
  comments: boolean;
};

export const postCommentsQuery = ({
  id,
  comments = true,
  range,
  limit,
  order,
  ascending,
}: PostCommentsQuery) => useQuery({
  queryKey: POST_COMMENTS_QUERY_KEY(id),
  queryFn: () => [],
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  enabled: comments && !!id,
});