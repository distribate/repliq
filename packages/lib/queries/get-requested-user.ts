'use server';

import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { getCurrentUser } from '../actions/get-current-user.ts';
import { REDIRECT_USER_NOT_EXIST } from '@repo/shared/constants/routes.ts';
import {
  convertUserPreferencesToObject,
  getPreferenceValue,
  UserPreferences,
} from '../helpers/convert-user-preferences-to-map.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { redirect } from 'next/navigation';
import { getDonateData } from '#queries/get-donate-data.ts';
import { DonateType } from '@repo/components/src/user/components/donate/queries/get-user-donate.ts';

type RequestedUserProps = {
  nickname: string,
  withDonate?: boolean
}

export type RequestedUser = Omit<UserEntity, 'preferences'> & {
  donate: DonateType["primary_group"],
  preferences: UserPreferences
}

async function getMainData(nickname: RequestedUserProps['nickname']) {
  const api = createClient();
  
  return api.from('users').select().eq('nickname', nickname).returns<UserEntity[]>().single();
}

async function validateUserDetailsVisibility(
  nickname: string,
  preferences: UserPreferences,
): Promise<{ real_name: boolean } | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const isOwnProfile = currentUser.nickname === nickname;
  
  if (isOwnProfile) return {
    real_name: true,
  };
  
  const result = getPreferenceValue(preferences, 'realNameVisibility');
  
  return { real_name: result, };
}

export async function getRequestedUser(
  nickname: RequestedUserProps['nickname'],
): Promise<RequestedUser | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const [ donate, main ] = await Promise.all([
    getDonateData(nickname), getMainData(nickname),
  ]);
  
  const { data: donateData, error: donateError } = donate;
  const { data: userData, error: userError } = main;
  
  if (!donateData || userError || donateError || !userData) {
    return redirect(`${REDIRECT_USER_NOT_EXIST}${currentUser.nickname}&timeout=5`);
  }
  
  const preferences = convertUserPreferencesToObject(userData.preferences as Record<string, string>) as UserPreferences;
  
  const detailsVisibility = await validateUserDetailsVisibility(
    nickname, preferences
  );
  
  if (!detailsVisibility) return null;
  
  return {
    ...userData,
    real_name: detailsVisibility.real_name ? userData.real_name : null,
    preferences,
    donate: donateData.primary_group,
  };
}