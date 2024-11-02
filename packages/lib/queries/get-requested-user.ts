"use server"

import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { getCurrentUser } from '../actions/get-current-user.ts';
import { REDIRECT_USER_NOT_EXIST } from '@repo/shared/constants/routes.ts';
import { convertUserPreferencesToObject, UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';
import { createClient } from "@repo/lib/utils/api/server.ts";
import { redirect } from 'next/navigation';

type RequestedUserProps = {
  nickname?: string,
  withDonate?: boolean
}

export type RequestedUser = Omit<UserEntity, 'preferences'> & {
  primary_group: string,
  preferences: UserPreferences
}

async function getDonateData(nickname: RequestedUserProps["nickname"]) {
  const api = createClient();
  
  return api
  .from('luckperms_players')
  .select('primary_group')
  .eq('username', nickname)
  .single();
}

async function getMainData(nickname: RequestedUserProps["nickname"]) {
  const api = createClient();
  
  return api
  .from('users')
  .select()
  .eq('nickname', nickname)
  .returns<UserEntity[]>()
  .single();
}

export async function getRequestedUser(
  nickname: RequestedUserProps["nickname"]
): Promise<RequestedUser | null> {
  const currentUser = await getCurrentUser();
  
  let requestedUser: RequestedUser | null = null;
  
  const [ donate, main ] = await Promise.all([
    getDonateData(nickname),
    getMainData(nickname),
  ]);
  
  const { data: donateData } = donate;
  const { data: mainData, error: mainDataError } = main;
  
  if (!donateData || mainDataError || !mainData) {
    if (currentUser) {
      return redirect(`${REDIRECT_USER_NOT_EXIST}${currentUser.nickname}&timeout=5)}`);
    }
    
    return null;
  }
  
  requestedUser = {
    ...mainData,
    preferences: convertUserPreferencesToObject(
      mainData.preferences as Record<string, string>,
    ) as UserPreferences,
    primary_group: donateData.primary_group,
  };
  
  return requestedUser;
}