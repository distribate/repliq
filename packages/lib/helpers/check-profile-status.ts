'use server';

import { getUserInformation } from '../queries/get-user-information.ts';;
import { RequestedUser } from '#queries/get-requested-user.ts';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';

export type CheckProfileStatus = {
  requestedUserNickname: string;
  currentUserNickname?: string;
};

export async function checkProfileStatus(
  requestedUser: RequestedUser,
) {
  const currentUser = await getUserInformation();
  if (!currentUser) return null;
  
  const { nickname: currentUserNickname } = currentUser;
  const { nickname: requestedNickname } = requestedUser;
  
  if (!currentUserNickname || !requestedNickname) return null;
  if (currentUserNickname === requestedNickname) return null;
  
  const res = await forumUserClient.user["get-user-profile-status"].$get({
    query: {
      initiator: currentUserNickname,
      recipient: requestedNickname
    }
  })

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data;
}