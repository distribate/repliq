"use server"

import { getCurrentSession } from "#actions/get-current-session.ts";
import { forumUserClient } from "@repo/shared/api/forum-client"

export const createProfileView = async (recipient: string) => {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  if (currentUser.nickname === recipient) return;

  const res = await forumUserClient.user["create-profile-view"].$post({
    json: {
      initiator: currentUser.nickname,
      recipient
    }
  })

  const data = await res.json();

  if (!data || "error" in data) {
    return;
  }

  return;
}