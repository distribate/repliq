'use server';

import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { checkProfileIsBlocked } from '@repo/lib/helpers/check-profile-is-blocked.ts';
import { getBlockType, ProfileStatusBlockedType } from '@repo/lib/helpers/check-profile-status.ts';
import { parseStringToBoolean } from '@repo/lib/helpers/parse-string-to-boolean.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

type CreateFriendRequest = {
  status: number,
  error: 'already-friends' | 'not-authorized' | ProfileStatusBlockedType | "user-not-accept" | null
};

async function validateUserFriendRequest(nickname: string) {
  const api = createClient()
  
  const { data, error } = await api
    .from("users")
    .select("preferences")
    .eq("nickname", nickname)
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  const preferences: { friendRequest: string } = data.preferences
  
  const isRequest = parseStringToBoolean(preferences.friendRequest)
  
  return isRequest ? isRequest : false
}

export async function createFriendRequest(requestedUserNickname: string): Promise<CreateFriendRequest> {
  const { user: currentUser } = await getCurrentSession();
  
  if (!currentUser) return {
    status: 400, error: 'not-authorized',
  };
  
  const api = createClient();
  
  const blockStatus = await checkProfileIsBlocked(requestedUserNickname);
  
  if (blockStatus) {
    return {
      status: 404,
      error: await getBlockType({
        requestedUserNickname,
        initiator: blockStatus.initiator,
        recipient: blockStatus.recipient,
      }),
    };
  }
  
  const { count } = await api
  .from('users_friends')
  .select('*', { count: 'exact' })
  .eq('user_1', currentUser.nickname)
  .eq('user_2', requestedUserNickname);
  
  const isExisting: boolean = count ? count !== 0 : false;
  
  if (isExisting) return {
    status: 400, error: 'already-friends',
  };
  
  const userIsAcceptFriends = await validateUserFriendRequest(requestedUserNickname)
  
  if (!userIsAcceptFriends) return {
    status: 400, error: "user-not-accept"
  };
  
  const { error, status } = await api
  .from('friends_requests')
  .insert({
    initiator: currentUser.nickname,
    recipient: requestedUserNickname,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { error: null, status };
}