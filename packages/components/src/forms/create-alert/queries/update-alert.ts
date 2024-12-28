"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";
import { AlertEntity } from "@repo/types/entities/entities-type.ts";

export type UpdateAlert = Omit<AlertEntity, "creator" | "created_at">;

export async function updateAlert({
  id,
  link,
  title,
  description,
}: UpdateAlert) {
  const api = createClient();

  const { data, error } = await api
    .from("config_alerts")
    .update({ title, link, description })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
