import { forumCommentClient } from "@repo/shared/api/forum-client";
import type { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment.ts"
import { z } from "zod";

type ReplyThreadComment = Omit<z.infer<typeof replyCommentBodySchema>, "parent_type" | "parent_id" | "initiator_comment_id"> & {
  threadId: string
}

export const replyThreadComment = async ({
  content, threadId, recipient_comment_id
}: ReplyThreadComment) => {
  const res = await forumCommentClient().comment["reply-comment"].$post({
    json: {
      content, parent_id: threadId, parent_type: "thread", recipient_comment_id
    },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null
  }

  return data;
}