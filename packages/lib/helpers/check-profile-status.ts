'use server';

import { getUserInformation } from '../queries/get-user-information.ts';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { checkProfileIsPrivate } from './check-profile-is-private.ts';
import { CheckProfileIsBlocked, checkProfileIsBlocked } from './check-profile-is-blocked.ts';
import { checkProfileIsBanned } from './check-profile-is-banned.ts';

export type CheckProfileStatus = {
  requestedUser: UserEntity,
  currentUserNickname?: string
}

export type ProfileStatusBlockedType =
  | 'blocked-by-user'  // if current user has been banned by requested user
  | 'user-blocked' // if current user banned requested user

export type ProfileStatusType = 'private' | 'banned' | ProfileStatusBlockedType | null

type GetBlockType = {
  requestedUserNickname: string,
} & CheckProfileIsBlocked

export async function getBlockType({
  initiator, recipient, requestedUserNickname
}: GetBlockType): Promise<ProfileStatusBlockedType> {
  if (recipient === requestedUserNickname) {
    return "user-blocked";
  }
  
  if (initiator === requestedUserNickname) {
    return "blocked-by-user";
  }
  
  throw new Error("Unhandled case in getBlockedType");
}

export async function checkProfileStatus(
  requestedUser: Pick<CheckProfileStatus, 'requestedUser'>["requestedUser"]
): Promise<ProfileStatusType> {
  try {
    
    const currentUser = await getUserInformation();
    if (!currentUser) return null;
    
    const currentUserNickname = currentUser.nickname;
    const requestedUserNickname = requestedUser.nickname;
    
    if (!currentUserNickname || !requestedUserNickname) return null
    if (currentUserNickname === requestedUserNickname) return null
    
    const banStatus = await checkProfileIsBanned(requestedUser.nickname);
    
    if (banStatus && banStatus.nickname === requestedUserNickname) {
      return 'banned'
    }
    
    const blockStatus = await checkProfileIsBlocked(requestedUserNickname);
    
    if (blockStatus) {
      return getBlockType({
        initiator: blockStatus.initiator,
        recipient: blockStatus.recipient,
        requestedUserNickname
      })
    }
    
    const isPrivate = await checkProfileIsPrivate({ requestedUser, currentUserNickname });
    if (!isPrivate) return 'private'
    
    return null
  } catch (e) {
    console.error('Error checking profile status:', e);
    return null
  }
}