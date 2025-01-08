import { forumUserClient } from '@repo/shared/api/forum-client.ts';

export async function checkProfileStatus(recipient: string) {
  const res = await forumUserClient().user["get-user-profile-status"].$get({
    query: { recipient }
  })

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data;
}