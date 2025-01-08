import { forumUserClient } from "@repo/shared/api/forum-client";

type DeleteFriend = {
  friend_id: string
}

export async function deleteFriend({ friend_id }: DeleteFriend) {
  const res = await forumUserClient().user["delete-friend"].$delete({
    json: { friend_id }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  const { status } = data

  return { status, error: null }
}