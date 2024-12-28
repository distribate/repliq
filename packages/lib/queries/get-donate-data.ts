"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";

export async function getDonateData(nickname: string) {
  const api = createClient();

  return api
    .from("luckperms_players")
    .select("primary_group")
    .eq("username", nickname)
    .single();
}
