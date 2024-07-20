'use server';

import { getUserInformation } from '../queries/get-user-information.ts';
import { USER } from '@repo/types/entities/entities-type.ts';
import { checkProfileIsPrivate } from './check-profile-is-private.ts';
import { checkProfileIsBlocked } from './check-profile-is-blocked.ts';
import { checkProfileIsBanned } from './check-profile-is-banned.ts';

export type CheckProfileStatus = {
  requestedUser: USER,
  currentUserNickname?: string
}

type ProfileStatusType = 'private' | 'banned' | 'blocked'

export async function checkProfileStatus({
  requestedUser,
}: Pick<CheckProfileStatus, 'requestedUser'>): Promise<ProfileStatusType | null> {
  const currentUser = await getUserInformation();
  
  const currentUserNickname = currentUser.nickname;
  const requestedUserNickname = requestedUser.nickname;
  
  if (!currentUserNickname || !requestedUserNickname) return null;
  if (currentUserNickname === requestedUserNickname) return null;
  
  const bannedType = await checkProfileIsBanned({ requestedUser });
  
  if (bannedType && bannedType.nickname === requestedUserNickname) {
    return 'banned';
  }
  
  const blockedType = await checkProfileIsBlocked({
    requestedUser
  });
  
  if (blockedType && blockedType.user_2 === currentUserNickname) {
    return 'blocked';
  }
  
  const profileType = await checkProfileIsPrivate({
    requestedUser, currentUserNickname
  });

  if (!profileType) return 'private';
  
  return null;
}