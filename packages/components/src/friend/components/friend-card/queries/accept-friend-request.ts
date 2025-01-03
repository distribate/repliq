'use server';

import { FriendRequestProperties } from '#friend/components/friend-card/types/friend-request-types.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';

type AcceptFriendRequestType = Pick<FriendRequestProperties, 'initiator'> & {
  friend_id: string;
};

export async function acceptFriendRequest({
  initiator,
  friend_id,
}: AcceptFriendRequestType) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const res = await forumUserClient.user["accept-friend-request"].$post({
    json: {
      currentUserNickname: initiator,
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
