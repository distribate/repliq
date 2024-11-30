'use server';

import { createClient } from '#utils/api/supabase-client.ts';
import { getCurrentUser } from '../actions/get-current-user.ts';
import { UpdateAvailableFields } from '../hooks/use-update-current-user.ts';
import { getUserDonate } from '@repo/components/src/user/components/donate/queries/get-user-donate.ts';
import { UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';
import { postUserPreferences } from './post-user-preferences.ts';

export type UpdateUserFields = {
  nickname: string,
  id: string,
  field: {
    [key in keyof UpdateAvailableFields]?: string | null;
  };
  preferences?: {
    key: keyof UserPreferences;
    value: boolean,
    oldPreferences: UserPreferences
  }
}

export const keysForCheckDonate: (
  keyof UpdateAvailableFields
  )[] = ["name_color", "favorite_item"];

export async function updateUserFields({
  field, nickname, id, preferences,
}: UpdateUserFields) {
  const api = createClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return;
  
  let isAccess: boolean = true;
  const fields = Object.keys(field).join(',');
  
  const updateFields = Object
  .entries(field)
  .reduce((acc, [ key, value ]) => {
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string | boolean | null });
  
  // let isTimeout: boolean = true;
  //
  // for (const field in updateFields) {
  //   console.log(field);
  //
  //   const data = await checkRequestTimeout({
  //     nickname, type: field,
  //   });
  //
  //   if (!data) return;
  //
  //   isTimeout = data.isAllowed;
  // }
  //
  // if (!isTimeout) return {
  //   data: 'Timeout', status: 400,
  // };
  
  const donate = await getUserDonate(currentUser.nickname);
  
  for (const key of keysForCheckDonate) {
    if (key in updateFields) {
      if (key === 'name_color' || key === 'favorite_item') {
        if (!donate) return;
        
        if (donate === 'default') {
          isAccess = false;
          break;
        }
      }
    }
  }
  
  if (updateFields['preferences'] && preferences) {
    if (donate === 'default') return;
    
    const { data, status } = await postUserPreferences({
      id: currentUser.id,
      key: preferences.key,
      oldPreferences: preferences.oldPreferences,
      value: preferences.value,
      nickname,
    });
    
    return { data, status };
  }
  
  if (!isAccess) return;
  
  const { data, error, status } = await api
  .from('users')
  .update(updateFields)
  .eq('nickname', nickname)
  .eq('id', id)
  .select(fields);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { data, status };
}