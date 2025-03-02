import { forumUserClient } from '@repo/shared/api/forum-client.ts';

type AcceptFriendRequest = {
  request_id: string
}

export async function acceptFriendRequest({ request_id }: AcceptFriendRequest) {
  const res = await forumUserClient.user["accept-friend-request"].$post({
    json: { request_id }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }  

  const { status } = data

  return { status, error: null }
}
