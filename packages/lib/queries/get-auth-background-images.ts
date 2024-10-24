"use server"

import { createClient } from '../utils/supabase/server.ts';

export async function getAuthBackgroundImages() {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .storage
  .from('static')
  .list('auth_background', {
    limit: 100, offset: 0
  })
  
  if (error || !data) {
    return null;
  }
  
  return data;
}