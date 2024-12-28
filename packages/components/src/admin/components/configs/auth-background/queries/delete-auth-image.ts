"use server";

import "server-only";
import { createClient } from "@repo/shared/api/supabase-client.ts";

export async function deleteAuthImage(imageName: string) {
  const api = createClient();

  const { data, error } = await api.storage
    .from("static")
    .remove([`auth_background/${imageName}`]);

  if (error) return;

  return data;
}
