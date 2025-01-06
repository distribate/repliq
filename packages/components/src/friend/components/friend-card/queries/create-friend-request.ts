import { forumUserClient } from "@repo/shared/api/forum-client";

export async function createFriendRequest(recipient: string) {
  const res = await forumUserClient().user["create-friend-request"].$post({
    json: {
      recipient
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }  

  const { status } = data

  return { status, error: null }
}