'use server';

import { USER } from '@repo/types/entities/entities-type.ts';
import { createClient } from '../utils/supabase/server.ts';
import { getCurrentUser } from '../actions/get-current-user.ts';
import { REDIRECT_USER_NOT_EXIST } from '@repo/shared/constants/routes.ts';
import { convertUserPreferencesToObject, UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';

type RequestedUserProps = {
  nickname?: string,
}

export type RequestedUser = Omit<USER, 'preferences'> & {
  primary_group: string,
  preferences: UserPreferences
}

async function getDonateData({
  nickname,
}: RequestedUserProps) {
  const supabase = createClient();
  return supabase.from('luckperms_players').select('primary_group').eq('username', nickname).single();
}

async function getMainData({
  nickname,
}: RequestedUserProps) {
  const supabase = createClient();
  return supabase.from('users').select().eq('nickname', nickname).returns<USER[]>().single();
}

export async function getRequestedUser({
  nickname
}: RequestedUserProps): Promise<RequestedUser | string> {
  const currentUser = await getCurrentUser();
  
  let requestedUser: RequestedUser | null = null;
  
  const [ donate, main ] = await Promise.all([
    getDonateData({ nickname }),
    getMainData({ nickname }),
  ]);
  
  const { data: donateData } = donate;
  const { data: mainData, error: mainDataError } = main;
  
  if (!donateData || mainDataError || !mainData) {
    if (currentUser) return `${REDIRECT_USER_NOT_EXIST}${currentUser.nickname}&timeout=5`;
    
    return `/not-found`;
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