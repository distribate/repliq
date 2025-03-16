import { forumCommentClient } from "@repo/shared/api/forum-client";

type CreateThreadComment = {
  content: string;
  threadId: string;
}

export async function createThreadComment({
  content, threadId
}: CreateThreadComment) {
  const res = await forumCommentClient.comment["create-comment"].$post({
    json: {
      content,
      parent_type: "thread",
      parent_id: threadId
    }
  });

  const data = await res.json();

  if (!data) {
    return null
  }

  return data;
}