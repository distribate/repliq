"use server";

import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";

export async function createFriendRequest(
  requestedUserNickname: string
) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const res = await forumUserClient.user["create-friend-request"].$post({
    json: {
      currentUserNickname: currentUser.nickname,
      requestedUserNickname
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }  

  const { status } = data

  return { status, error: null }
}