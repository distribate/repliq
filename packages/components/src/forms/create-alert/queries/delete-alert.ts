"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";

export async function deleteAlert(alertId: number) {
  const api = createClient();
  
  const { data, error } = await api
  .from("config_alerts")
  .delete()
  .eq("id", alertId)
  .select()
  .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}