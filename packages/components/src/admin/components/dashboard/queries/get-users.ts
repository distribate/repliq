'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { Tables } from '@repo/types/entities/supabase';

export async function getUsers() {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('users')
  .select("id, nickname, uuid, created_at, name_color")
  
  if (error) throw new Error(error.message);
  
  return data;
}