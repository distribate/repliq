"use server";

import { createClient } from "../../../../../lib/utils/api/supabase-client.ts";

export async function deleteAlert(alertId: number) {
  const api = createClient();

  const { data, error } = await api
    .from("config_alerts")
    .delete()
    .eq("id", alertId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
