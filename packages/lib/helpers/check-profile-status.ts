'use server';

import { getUserInformation } from '../queries/get-user-information.ts';
import { checkProfileIsPrivate } from './check-profile-is-private.ts';
import {
  CheckProfileIsBlocked,
  checkProfileIsBlocked,
} from './check-profile-is-blocked.ts';
import { checkProfileIsBanned } from './check-profile-is-banned.ts';
import { RequestedUser } from '#queries/get-requested-user.ts';

export type CheckProfileStatus = {
  requestedUserNickname: string;
  currentUserNickname?: string;
};

export type ProfileStatusBlockedType =
  | 'blocked-by-user' // if current user has been banned by requested user
  | 'user-blocked' // if current user banned requested user

export type ProfileStatusType =
  | 'private'
  | 'banned'
  | ProfileStatusBlockedType
  | null;

type GetBlockType = {
  requestedUserNickname: string;
} & CheckProfileIsBlocked;

export async function getBlockType({
  initiator, recipient, requestedUserNickname,
}: GetBlockType): Promise<ProfileStatusBlockedType> {
  if (recipient === requestedUserNickname) {
    return 'user-blocked';
  }
  
  if (initiator === requestedUserNickname) {
    return 'blocked-by-user';
  }
  
  throw new Error("Blocked type is not defined")
}

export async function checkProfileStatus(
  requestedUser: RequestedUser,
): Promise<ProfileStatusType> {
  const currentUser = await getUserInformation();
  if (!currentUser) return null;
  
  const { nickname: currentUserNickname } = currentUser;
  const { nickname: requestedNickname } = requestedUser;
  
  if (!currentUserNickname || !requestedNickname) return null;
  if (currentUserNickname === requestedNickname) return null;
  
  try {
    const banStatus = await checkProfileIsBanned(requestedNickname);
    
    if (banStatus && banStatus.nickname === requestedNickname) {
      return 'banned';
    }
    
    const blockStatus = await checkProfileIsBlocked(requestedNickname);
    
    if (blockStatus) {
      const { initiator, recipient } = blockStatus;
      
      return getBlockType({
        initiator, recipient,
        requestedUserNickname: requestedUser.nickname,
      });
    }
    
    const isPrivate = await checkProfileIsPrivate({
      requestedUser, currentUserNickname,
    });
    
    if (!isPrivate) return 'private';
    
    return null;
  } catch (e) {
    return null;
  }
}