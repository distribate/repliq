import { forumUserClient } from "@repo/shared/api/forum-client"

export const createProfileView = async (initiator: string, recipient: string) => {
  if (initiator === recipient) return;

  const res = await forumUserClient().user["create-profile-view"].$post({
    json: { recipient }
  })

  const data = await res.json();

  if (!data || "error" in data) {
    return;
  }

  return data;
}