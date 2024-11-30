"use server"

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from "../../../../../lib/utils/api/supabase-client.ts";
import { AlertEntity } from '@repo/types/entities/entities-type.ts';

export type CreateAlert = Omit<AlertEntity, "id" | "created_at" | "creator">

export async function createAlert({
  link, title, description
}: CreateAlert) {
  const currentUser = await getCurrentUser()
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from("config_alerts")
  .insert({ creator: currentUser.nickname, link, title, description })
  .select()
  .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}