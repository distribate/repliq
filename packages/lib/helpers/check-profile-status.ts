import { forumUserClient } from '@repo/shared/api/forum-client.ts';

export type CheckProfileStatus = {
  requestedUserNickname: string;
};

export async function checkProfileStatus(requestedUserNickname: string) {
  const res = await forumUserClient().user["get-user-profile-status"].$get({
    query: {
      recipient: requestedUserNickname
    }
  })

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data;
}