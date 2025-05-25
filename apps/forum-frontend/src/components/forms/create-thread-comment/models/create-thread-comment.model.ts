import {
  CreateThreadComment,
  createThreadCommentAtom,
} from "../queries/create-thread-comment-query.ts";
import { toast } from "sonner";
import { GetThreadCommentsResponse } from "@repo/types/entities/thread-comments-types.ts";
import { threadCommentsAction, threadCommentsDataAtom } from "#components/thread/thread-comments/models/thread-comments.model.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { forumCommentClient } from "@repo/shared/api/forum-client";
import type { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment.ts"
import { z } from "zod";

function validateContent(input?: string): string | null {
  return input ? input.trim().split(/\s+/).length > 0 ? input : null : null
}

async function createThreadComment({
  content, threadId
}: {
  content: string;
  threadId: string;
}) {
  const res = await forumCommentClient.comment["create-comment"].$post({
    json: { content, parent_type: "thread", parent_id: threadId }
  });

  const data = await res.json();
  if (!data) return null

  return data;
}

type ReplyThreadComment = Omit<z.infer<typeof replyCommentBodySchema>, "parent_type" | "parent_id" | "initiator_comment_id"> & {
  threadId: string
}

const replyThreadComment = async ({
  content, threadId, recipient_comment_id
}: ReplyThreadComment) => {
  const res = await forumCommentClient.comment["reply-comment"].$post({
    json: { content, parent_id: threadId, parent_type: "thread", recipient_comment_id },
  });

  const data = await res.json();
  if (!data) return null

  return data;
}

export const updateCreateThreadCommentAction = reatomAsync(async (ctx, values: Partial<CreateThreadComment>) => {
  const { content, replied, type, threadId } = values;

  createThreadCommentAtom(ctx, (state) => ({
    threadId: threadId ?? state.threadId,
    type: type ?? state.type,
    content: validateContent(content) ?? state.content,
    replied: { 
      ...state.replied,
      commentContent: replied?.commentContent!,
      commentId: replied?.commentId!,
      commentNickname: replied?.commentNickname!
    },
  }))
}, "updateCreateThreadCommentAction").pipe(withStatusesAtom())

export const createThreadCommentAction = reatomAsync(async (ctx) => {
  const { threadId, content, type, replied } = ctx.get(createThreadCommentAtom);

  if (!content) return;

  switch (type) {
    case "reply":
      if (!replied?.commentId) return;

      const createdRepliedComment = await replyThreadComment({
        content, threadId,
        recipient_comment_id: replied.commentId.toString()
      });

      return { createdRepliedComment, threadId }
    case "single":
      const createdSingleComment = await createThreadComment({ threadId, content });

      return { createdSingleComment, threadId }
    default:
      break;
  }
}, {
  name: "createThreadCommentAction",
  onFulfill: (ctx, res) => {
    if (!res) return toast.error("Что-то пошло не так!");

    if (res.createdSingleComment && "error" in res.createdSingleComment) {
      return toast.error("Что-то пошло не так!")
    }

    if (res.createdRepliedComment && "error" in res.createdRepliedComment) {
      return toast.error("Что-то пошло не так!")
    }

    const currentThreadComments = ctx.get(threadCommentsDataAtom)

    if (!currentThreadComments || !currentThreadComments.length) {
      threadCommentsAction(ctx)
    } else {
      let newComment: GetThreadCommentsResponse["data"][0] | null = null
      const threadComment = ctx.get(createThreadCommentAtom)

      switch (threadComment.type) {
        case "reply":
          if (res.createdRepliedComment!.data.status !== 'Created') {
            return;
          }

          let repliedComment = res.createdRepliedComment!.data.data!

          const repliedInitComment = threadComment.replied?.commentId
            ? currentThreadComments.find(d => d.id === threadComment.replied?.commentId)
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
          if (res.createdSingleComment!.data.status !== 'Created') {
            return
          }

          let singleComment = res.createdSingleComment!.data.data!

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
        threadCommentsDataAtom(ctx, (state) => {
          if (!state) {
            state = []
          }
          
          return [newComment, ...state]
        })
      } else {
        threadCommentsAction(ctx)
      }
    }

    createThreadCommentAtom.reset(ctx)
  }
}).pipe(withStatusesAtom())