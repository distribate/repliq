"use server"

import { createClient } from '@repo/lib/utils/supabase/server.ts';

export async function getAuthImagesCount() {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .storage
  .from('static')
  .list('auth_background', {
    limit: 50, offset: 0,
  });
  
  if (error) return;
  
  return data.length;
}