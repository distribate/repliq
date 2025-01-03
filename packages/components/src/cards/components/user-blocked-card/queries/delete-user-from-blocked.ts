"use server";

import "server-only";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { getCurrentSession } from "@repo/lib/actions/get-current-session";

export type DeleteUserFromBlocked = {
  recipient: string;
};

export async function deleteUserFromBlocked({
  recipient,
}: DeleteUserFromBlocked) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const res = await forumUserClient.user["control-user-blocked"].$post({
    json: {
      initiator: currentUser.nickname,
      recipient,
      type: "unblock"
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  const { status } = data;

  return { status }
}