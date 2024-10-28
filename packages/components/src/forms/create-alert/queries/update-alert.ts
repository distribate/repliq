"use server"

import { Tables } from '@repo/types/entities/supabase.ts';
import { createClient } from "@repo/lib/utils/api/server.ts";

export type UpdateAlert = Omit<Tables<"config_alerts">, "creator" | "created_at">

export async function updateAlert({
  id, link, title, description
}: UpdateAlert) {
  const api = createClient();
  
  const { data, error } = await api
  .from("config_alerts")
  .update({
    title, link, description
  })
  .eq("id", id)
  .select()
  .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}