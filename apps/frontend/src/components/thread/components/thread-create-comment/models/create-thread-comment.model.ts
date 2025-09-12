import {
  createThreadCommentContentAtom,
  createThreadCommentRepliedAtom,
  createThreadCommentReset,
  createThreadCommentThreadIdAtom,
  createThreadCommentTypeAtom,
} from "./thread-comment.model.ts";
import { toast } from "sonner";
import { GetThreadCommentsResponse } from "@repo/types/entities/thread-comments-types.ts";
import { threadCommentsAction, threadCommentsDataAtom } from "#components/thread/components/thread-comments/models/thread-comments.model.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { commentClient } from "#shared/api/forum-client.ts";
import type { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment.ts"
import * as z from "zod";
import { COMMENT_LIMIT } from "@repo/shared/constants/limits";
import { atom } from "@reatom/core";
import { validateResponse } from "#shared/api/validation.ts";

const createThreadCommentSchema = z.object({
  content: z
    .string()
    .min(COMMENT_LIMIT[0], { error: `Content must be at least ${COMMENT_LIMIT[0]} characters long` })
    .max(COMMENT_LIMIT[1], { error: `Content must be less than ${COMMENT_LIMIT[1]} characters long` })
    .refine(content => {
      const emptyLines = content.split('\n').filter(line => line.trim() === '').length;
      const tripleSpaces = content.split('   ').length - 1;

      return emptyLines <= 2 && tripleSpaces <= 3;
    }, {
      error: 'Cannot have more than two empty lines or more than three consecutive spaces',
    }),
})

async function createThreadComment({
  content, threadId
}: {
  content: string; threadId: string;
}) {
  const res = await commentClient.comment["create-comment"].$post({
    json: { content, parent_type: "thread", parent_id: threadId }
  });

  return validateResponse<typeof res>(res)
}

type ReplyThreadComment = Omit<z.infer<typeof replyCommentBodySchema>,
  | "parent_type"
  | "parent_id"
  | "initiator_comment_id"
> & {
  threadId: string
}

const replyThreadComment = async ({
  content, threadId, recipient_comment_id
}: ReplyThreadComment) => {
  const res = await commentClient.comment["reply-comment"].$post({
    json: { content, parent_id: threadId, parent_type: "thread", recipient_comment_id },
  });

  return validateResponse<typeof res>(res)
}

type NewComment = GetThreadCommentsResponse["data"][0]

function validateContent(input?: string): string | null {
  return input ? input.trim().split(/\s+/).length > 0 ? input : null : null
}

export const createThreadCommentAction = reatomAsync(async (ctx) => {
  const threadId = ctx.get(createThreadCommentThreadIdAtom)
  const raw = ctx.get(createThreadCommentContentAtom)
  const content = validateContent(raw);
  const replied = ctx.get(createThreadCommentRepliedAtom);

  if (!content) {
    throw new Error("Content not found")
  }

  const type = ctx.get(createThreadCommentTypeAtom)

  if (type === 'reply') {
    if (!replied) {
      throw new Error("Id is not defined")
    }

    const recipient_comment_id = replied.commentId.toString()

    return await ctx.schedule(() => replyThreadComment({ content, threadId, recipient_comment_id }));
  }

  if (type === 'single') {
    return await ctx.schedule(() => createThreadComment({ threadId, content }))
  }

  throw new Error(`Type is not defined ${type}`)
}, {
  name: "createThreadCommentAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error("Что-то пошло не так!")
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    const currentThreadComments = ctx.get(threadCommentsDataAtom)

    if (!currentThreadComments || !currentThreadComments.length) {
      threadCommentsAction(ctx)
      return;
    }

    let newComment: NewComment | null = null;

    const threadComment = ctx.get(createThreadCommentRepliedAtom)
    const type = ctx.get(createThreadCommentTypeAtom);

    if (type === 'reply') {
      if (res.status !== 'Created') return;

      let repliedComment = res.data

      const repliedInitComment = threadComment?.commentId
        ? currentThreadComments.find(d => d.id === threadComment?.commentId)
        : null

      newComment = {
        id: Number(repliedComment.id),
        content: repliedComment.content,
        created_at: repliedComment.created_at,
        is_updated: repliedComment.is_updated,
        replied: repliedInitComment ?? null,
        updated_at: repliedComment.updated_at,
        user: {
          nickname: repliedComment.nickname,
          avatar: repliedComment.avatar ?? null
        }
      }
    }

    if (type === 'single') {
      if (res.status !== 'Created') return

      let singleComment = res.data

      newComment = {
        id: Number(singleComment.id),
        content: singleComment.content,
        created_at: singleComment.created_at,
        is_updated: singleComment.is_updated,
        replied: null,
        updated_at: singleComment.updated_at,
        user: {
          nickname: singleComment.nickname,
          avatar: singleComment.avatar ?? null
        }
      }
    }

    if (!newComment) {
      threadCommentsAction(ctx)
    } else {
      threadCommentsDataAtom(ctx, (state) => {
        if (!state) state = []

        const newData = [newComment, ...state];

        return newData
      })
    }
  },
  onSettle: (ctx) => {
    createThreadCommentReset(ctx)
  }
}).pipe(withStatusesAtom())

export const textareaIsActiveAtom = atom(false, "textareaIsActive")

export const isValidAtom = atom((ctx) => {
  const content = ctx.spy(createThreadCommentContentAtom);
  const result = createThreadCommentSchema.safeParse({ content })
  return result.success
}, "isValid")