import { forumPostClient } from "@repo/shared/api/forum-client";

export async function editPost({
  content, id
}: {
  id: string,
  content: string
}) {
  const res = await forumPostClient.post["edit-post"].$post({
    json: {  id, content }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}