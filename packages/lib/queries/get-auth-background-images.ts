"use server";

import { createClient } from "#utils/api/supabase-client.ts";

export async function getAuthBackgroundImages() {
  const api = createClient();

  const { data, error } = await api.storage
    .from("static")
    .list("auth_background", {
      limit: 100,
      offset: 0,
    });

  if (error || !data) {
    return null;
  }

  return data;
}
