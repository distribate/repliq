'use server';

import { createClient } from '../utils/supabase/server.ts';
import { getCurrentUser } from '../actions/get-current-user.ts';
import { AvailableFields } from '../hooks/use-update-current-user.ts';
import { getUserDonate } from '@repo/components/src/user/components/donate/queries/get-user-donate.ts';
import { keysForCheckDonate } from '@repo/shared/constants/user-fields-donated.ts';
import { UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';
import { createRequestTimeout } from '../helpers/set-request-timeout.ts';
import dayjs from 'dayjs';

export type UpdateUserFields = {
  nickname: string,
  id: string,
  field: {
    [key in keyof AvailableFields]?: string | null;
  };
  preferences?: {
    key: keyof UserPreferences;
    value: boolean,
    oldPreferences: UserPreferences
  }
}

type PostUserPreferences = Pick<
  UpdateUserFields, 'nickname' | 'id'
> & {
  value: boolean, key: keyof UserPreferences, oldPreferences: UserPreferences
}

async function postUserPreferences({
  value, nickname, id, oldPreferences, key,
}: PostUserPreferences) {
  const supabase = createClient();
  
  const transformedPreferences = Object.entries(oldPreferences).reduce((acc, [ key, value ]) => {
    acc[key] = value.toString();
    return acc;
  }, {} as { [key: string]: string });
  
  const updateFields = {
    ...transformedPreferences,
    [key as string]: value.toString(),
  };
  
  const { data, error, status } = await supabase
  .from('users')
  .update({ preferences: updateFields })
  .eq('nickname', nickname)
  .eq('id', id)
  .select()
  .single();
  
  if (error) console.error(error.message);
  
  return { data, status };
}

export async function updateUserFields({
  field, nickname, id, preferences,
}: UpdateUserFields) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return;
  
  let isAccess: boolean = true;
  const fields = Object.keys(field).join(',');
  
  const updateFields = Object.entries(field).reduce((acc, [ key, value ]) => {
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
      nickname
    });
    
    return { data, status };
  }
  
  if (!isAccess) return;
  
  try {
    const { data, error, status } = await supabase
    .from('users')
    .update(updateFields)
    .eq('nickname', nickname)
    .eq('id', id)
    .select(fields);
    
    if (error) console.error(error.message);
    
    let isSuccess: boolean = false;
    
    for (const field in updateFields) {
      const issuedTime = dayjs().add(5, 'minute')

      const requestTimeout = await createRequestTimeout({
        type: field,
        issued_at: dayjs(issuedTime).toString(),
        user_nickname: nickname,
      });

      isSuccess = !!requestTimeout;
    }
    
    if (!isSuccess) return;
    
    return { data, status };
  } catch (e) { throw e }
}