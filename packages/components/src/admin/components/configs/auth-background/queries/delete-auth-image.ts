"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export async function deleteAuthImage(imageName: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .storage
  .from('static')
  .remove([`auth_background/${imageName}`])
  
  if (error) return;
  
  return data;
}