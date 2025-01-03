"use server";

import "server-only";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";

export async function deleteFriend(friend_id: string) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const res = await forumUserClient.user["delete-friend"].$delete({
    json: {
      currentUserNickname: currentUser.nickname,
      friend_id
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }  

  const { status } = data

  return { status, error: null }
}
