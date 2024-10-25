"use server"

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { Tables } from '@repo/types/entities/supabase.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export type CreateAlert = Omit<Tables<"config_alerts">, "id" | "created_at" | "creator">

export async function createAlert({
  link, title, description
}: CreateAlert) {
  const currentUser = await getCurrentUser()
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from("config_alerts")
  .insert({
    creator: currentUser.nickname, link, title, description
  })
  .select()
  .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}