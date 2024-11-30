"use server"

import { createClient } from '../utils/api/supabase-client.ts';
import { UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';
import { UpdateUserFields } from './update-user-fields.ts';

type PostUserPreferences = Pick<
  UpdateUserFields, 'nickname' | 'id'
> & {
  value: boolean, key: keyof UserPreferences, oldPreferences: UserPreferences
}

export async function postUserPreferences({
  value, nickname, id, oldPreferences, key,
}: PostUserPreferences) {
  const api = createClient();
  
  const transformedPreferences = Object
  .entries(oldPreferences)
  .reduce((acc, [ key, value ]) => {
    acc[key] = value.toString();
    return acc;
  }, {} as { [key: string]: string });
  
  const updateFields = {
    ...transformedPreferences,
    [key as string]: value.toString(),
  };
  
  const { data, error, status } = await api
  .from('users')
  .update({ preferences: updateFields })
  .eq('nickname', nickname)
  .eq('id', id)
  .select()
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { data, status };
}