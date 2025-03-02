import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const CREATE_THREAD_COMMENT_QUERY_KEY = createQueryKey("ui", [
  "create-thread-comment",
]);

export type CreateThreadCommentType = "single" | "reply";

export type RepliedValuesType = {
  commentId: number;
  commentNickname: string;
  commentContent: string;
};

export type CreateThreadCommentQuery = {
  threadId: string;
  type: CreateThreadCommentType;
  replied: RepliedValuesType | null;
  content: string;
}

export const createThreadCommentQuery = () => useQuery<CreateThreadCommentQuery | null, Error>({
  queryKey: CREATE_THREAD_COMMENT_QUERY_KEY,
  staleTime: Infinity,
  gcTime: Infinity,
  initialData: {
    content: "",
    threadId: "",
    type: "single",
    replied: null
  },
  refetchOnMount: true,
});