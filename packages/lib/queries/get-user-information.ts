'use server';

import { DonateType, getUserDonate } from '@repo/components/src/user/components/donate/queries/get-user-donate.ts';
import { convertUserPreferencesToObject, UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';
import { getUserBanned } from './get-user-banned.ts';
import { CurrentUser } from './current-user-query.ts';
import { createClient } from '#utils/api/supabase-client.ts';
import { permanentRedirect } from 'next/navigation';
import { BANNED_REDIRECT } from '@repo/shared/constants/routes.ts';
import { getCurrentSession } from '#actions/get-current-session.ts';

export async function getUserInformation(): Promise<CurrentUser | null> {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;
  
  const api = createClient();
  
  let query = api
  .from('users')
  .select(`
		id,created_at,uuid,nickname,description,status,birthday,real_name,
		preferences,cover_image,visibility,name_color,favorite_item
	`)
  .eq('nickname', currentUser.nickname)
  .eq('id', currentUser.id)
  .single();
  
  const isBanned = await getUserBanned(currentUser.nickname);
  
  if (isBanned) {
    return permanentRedirect(BANNED_REDIRECT);
  }
  
  const [ user, donate ] = await Promise.all([
    query,
    getUserDonate(currentUser.nickname),
  ]);
  
  const { data, error } = user;
  
  let userDonate: DonateType['primary_group'] | null = null;
  
  if (donate) {
    userDonate = donate;
  }
  
  if (error) {
    throw new Error(error.message);
  }
  
  return {
    id: data.id,
    status: data.status,
    name_color: data.name_color,
    created_at: data.created_at,
    nickname: data.nickname,
    favorite_item: data.favorite_item,
    uuid: data.uuid,
    cover_image: data.cover_image,
    real_name: data.real_name,
    description: data.description,
    birthday: data.birthday,
    donate: userDonate,
    preferences: convertUserPreferencesToObject(data.preferences) as UserPreferences,
    visibility: data.visibility,
  };
}