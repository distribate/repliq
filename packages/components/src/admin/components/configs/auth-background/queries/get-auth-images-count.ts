"use server";

import { createClient } from "../../../../../../../lib/utils/api/supabase-client.ts";

export async function getAuthImagesCount() {
  const api = createClient();

  const { data, error } = await api.storage
    .from("static")
    .list("auth_background", {
      limit: 50,
      offset: 0,
    });

  if (error) return;

  return data.length;
}
