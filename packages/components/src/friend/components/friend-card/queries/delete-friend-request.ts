"use server";

import "server-only";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";

export async function deleteFriendRequest(
  friend_id: string,
) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const res = await forumUserClient.user["delete-friend-request"].$post({
    json: {
      friend_id,
      currentUserNickname: currentUser.nickname
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }  

  const { status } = data

  return { status, error: null }
}
