import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CREATE_THREAD_COMMENT_QUERY_KEY,
  CreateThreadCommentQuery,
} from "../queries/create-thread-comment-query.ts";
import { toast } from "sonner";
import { THREAD_COMMENTS_QUERY_KEY } from "#components/thread/components/thread-comments/queries/thread-comments-query.ts";
import { GetThreadCommentsResponse } from "@repo/types/entities/thread-comments-types.ts";
import { useUpdateComments } from "#components/thread/components/thread-comments/hooks/use-update-comments.ts";
import { replyThreadComment } from "../queries/reply-thread-comment.ts";
import { createThreadComment } from "../queries/create-thread-comment.ts";

export const useCreateThreadComment = () => {
  const qc = useQueryClient();
  const { updateCommentsMutation } = useUpdateComments()

  const updateCreateThreadCommentMutation = useMutation({
    mutationFn: async (values: Partial<CreateThreadCommentQuery>) => {
      const { content, replied, type, threadId } = values;

      const updatedContent = content
        ? content.trim().split(/\s+/).length > 0
          ? content
          : null
        : null;

      return qc.setQueryData(
        CREATE_THREAD_COMMENT_QUERY_KEY,
        (prev: CreateThreadCommentQuery) => ({
          threadId: threadId ?? prev.threadId,
          type: type ?? prev.type,
          content: updatedContent ?? prev.content,
          replied: { ...prev.replied, ...replied },
        }),
      );
    },
    onError: e => { throw new Error(e.message) },
  });

  const createThreadCommentMutation = useMutation({
    mutationFn: async () => {
      const threadComment = qc.getQueryData<CreateThreadCommentQuery>(CREATE_THREAD_COMMENT_QUERY_KEY);
      if (!threadComment) return;

      const thread_id = threadComment.threadId;
      const content = threadComment.content;
      const type = threadComment.type || "single";

      if (!thread_id || !content) return;

      switch (type) {
        case "reply":
          if (!threadComment.replied?.commentId) return;

          const recipient_comment_id = threadComment.replied.commentId

          const repliedThreadComment = await replyThreadComment({
            content, threadId: thread_id, recipient_comment_id: recipient_comment_id.toString()
          });

          return { repliedThreadComment, thread_id };
        case "single":
          const threadCommentId = await createThreadComment({
            threadId: thread_id, content
          });

          return { threadCommentId, thread_id };
        default:
          break;
      }
    },
    onSuccess: async (data) => {
      if (!data) return toast.error("Что-то пошло не так!");

      const threadComment = qc.getQueryData<CreateThreadCommentQuery>(CREATE_THREAD_COMMENT_QUERY_KEY);
      if (!threadComment) return;

      const currentThreadComments = qc.getQueryData<GetThreadCommentsResponse>(
        THREAD_COMMENTS_QUERY_KEY(data.thread_id)
      );

      if (!currentThreadComments || (currentThreadComments && currentThreadComments.data.length === 0)) {
        return qc.invalidateQueries({
          queryKey: THREAD_COMMENTS_QUERY_KEY(data.thread_id),
        });
      }

      updateCommentsMutation.mutate({
        cursor: currentThreadComments.meta.endCursor,
        threadId: threadComment.threadId
      })

      qc.resetQueries({ queryKey: CREATE_THREAD_COMMENT_QUERY_KEY });
    },
    onError: e => { throw new Error(e.message) },
  });

  return { updateCreateThreadCommentMutation, createThreadCommentMutation };
};