import { forumUserClient } from "@repo/shared/api/forum-client";

export async function deleteFriendRequest(request_id: string) {
  const res = await forumUserClient().user["delete-friend-request"].$post({
    json: {
      request_id
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }  

  const { status } = data

  return { status, error: null }
}