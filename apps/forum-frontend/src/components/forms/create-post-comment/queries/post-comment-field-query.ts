import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export type PostCommentField = {
  post_id: string | null;
  content?: string;
};

export const POST_COMMENT_FIELD_QUERY_KEY = (post_id: string) =>
  createQueryKey("ui", ["create-post-comment-state"], post_id);
