import { forumPostClient } from "@repo/shared/api/forum-client";

export async function pinPost({
  id,
  value
}: {
  id: string;
  value: boolean
}) {
  const res = await forumPostClient.post["pin-post"].$post({
    json: { id, value }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}