import { forumUserClient } from "@repo/shared/api/forum-client";

export type DeleteUserFromBlocked = {
  recipient: string;
};

export async function deleteUserFromBlocked({
  recipient,
}: DeleteUserFromBlocked) {
  const res = await forumUserClient().user["control-user-blocked"].$post({
    json: {
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