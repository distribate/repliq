import { forumCommentClient } from "@repo/shared/api/forum-client";

export async function disablePostComments({
  id
}: {
  id: string
}) {
  const res = await forumCommentClient.comment["disable-comments"].$post({
    json: {
      id,
      type: "post"
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}