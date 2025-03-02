import { forumPostClient } from "@repo/shared/api/forum-client";

export async function createPost({
  content,
  isComments,
  isPinned,
  visibility
}: {
  content: string,
  isComments: boolean,
  isPinned: boolean,
  visibility: "only" | "all" | "friends"
}) {
  const res = await forumPostClient.post["create-post"].$post({
    json: {
      content, isComments, isPinned, visibility
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}