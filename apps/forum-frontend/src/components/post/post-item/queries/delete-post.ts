import { forumPostClient } from "@repo/shared/api/forum-client";

export async function deletePost({
  id
}: {
  id: string
}) {
  const res = await forumPostClient.post["delete-post"].$delete({
    json: { id  }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}