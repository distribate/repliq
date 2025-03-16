import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CREATE_THREAD_COMMENT_QUERY_KEY,
  CreateThreadCommentQuery,
} from "../queries/create-thread-comment-query.ts";
import { toast } from "sonner";
import { THREAD_COMMENTS_QUERY_KEY } from "#components/thread/components/thread-comments/queries/thread-comments-query.ts";
import { GetThreadCommentsResponse } from "@repo/types/entities/thread-comments-types.ts";
import { replyThreadComment } from "../queries/reply-thread-comment.ts";
import { createThreadComment } from "../queries/create-thread-comment.ts";

function validateContent(input?: string): string | null {
  return input ? input.trim().split(/\s+/).length > 0 ? input : null : null
}

export const useCreateThreadComment = () => {
  const qc = useQueryClient();

  const updateCreateThreadCommentMutation = useMutation({
    mutationFn: async (values: Partial<CreateThreadCommentQuery>) => {
      const { content, replied, type, threadId } = values;

      return qc.setQueryData(CREATE_THREAD_COMMENT_QUERY_KEY,
        (prev: CreateThreadCommentQuery) => ({
          threadId: threadId ?? prev.threadId,
          type: type ?? prev.type,
          content: validateContent(content) ?? prev.content,
          replied: {
            ...prev.replied, ...replied
          },
        }),
      );
    },
    onError: e => { throw new Error(e.message) },
  });

  const createThreadCommentMutation = useMutation({
    mutationFn: async () => {
      const threadComment = qc.getQueryData<CreateThreadCommentQuery>(CREATE_THREAD_COMMENT_QUERY_KEY);

      if (!threadComment) return;

      const { threadId, content, type } = threadComment;

      if (!threadId || !content) return;

      switch (type) {
        case "reply":
          if (!threadComment.replied?.commentId) return;

          const createdRepliedComment = await replyThreadComment({
            content, threadId,
            recipient_comment_id: threadComment.replied.commentId.toString()
          });

          return { createdRepliedComment, threadId }
        case "single":
          const createdSingleComment = await createThreadComment({ threadId, content });

          return { createdSingleComment, threadId }
        default:
          break;
      }
    },
    onSuccess: async (data) => {
      if (!data) return toast.error("Что-то пошло не так!");

      if (data.createdSingleComment && "error" in data.createdSingleComment) {
        return toast.error("Что-то пошло не так!")
      }

      if (data.createdRepliedComment && "error" in data.createdRepliedComment) {
        return toast.error("Что-то пошло не так!")
      }

      const threadComment = qc.getQueryData<CreateThreadCommentQuery>(CREATE_THREAD_COMMENT_QUERY_KEY);
      if (!threadComment) return;

      const currentThreadComments = qc.getQueryData<GetThreadCommentsResponse>(THREAD_COMMENTS_QUERY_KEY(data.threadId));

      if (!currentThreadComments?.data || !currentThreadComments?.data.length) {
        return qc.invalidateQueries({ queryKey: THREAD_COMMENTS_QUERY_KEY(data.threadId) });
      } else {
        let newComment: GetThreadCommentsResponse["data"][0] | null = null

        switch (threadComment.type) {
          case "reply":
            if (data.createdRepliedComment!.data.status !== 'Created') {
              return;
            }

            let repliedComment = data.createdRepliedComment!.data.data!

            const repliedInitComment = threadComment.replied?.commentId
              ? currentThreadComments.data.find(d => d.id === threadComment.replied?.commentId)
              : null

            newComment = {
              id: Number(repliedComment.id),
              content: repliedComment.content,
              created_at: repliedComment.created_at,
              is_updated: repliedComment.is_updated,
              replied: repliedInitComment ?? null,
              updated_at: repliedComment.updated_at,
              user_nickname: repliedComment.user_nickname
            }

            break;
          case "single":
            if (data.createdSingleComment!.data.status !== 'Created') {
              return
            }

            let singleComment = data.createdSingleComment!.data.data!

            newComment = {
              id: Number(singleComment.id),
              content: singleComment.content,
              created_at: singleComment.created_at,
              is_updated: singleComment.is_updated,
              replied: null,
              updated_at: singleComment.updated_at,
              user_nickname: singleComment.user_nickname
            }

            break;
          default:
            break;
        }

        if (newComment) {
          qc.setQueryData(THREAD_COMMENTS_QUERY_KEY(data.threadId), (prev: GetThreadCommentsResponse) => ({
            ...prev,
            data: [newComment, ...prev.data]
          }))
        } else {
          qc.invalidateQueries({ queryKey: THREAD_COMMENTS_QUERY_KEY(data.threadId) });
        }
      }

      qc.setQueryData(CREATE_THREAD_COMMENT_QUERY_KEY, (prev: CreateThreadCommentQuery) => ({
        ...prev, type: "single", content: null, replied: null
      }))
    },
    onError: e => { throw new Error(e.message) },
  });

  return { updateCreateThreadCommentMutation, createThreadCommentMutation };
};