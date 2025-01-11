"use server"

import { createClient } from "@repo/shared/api/supabase-client";

export async function getServerIp(): Promise<string> {
  const api = createClient();

  const { data, error } = await api
    .from("ip_list")
    .select("ip")
    .eq("name", "server_proxy")
    .single()

  if (error) {
    throw new Error("Failed to get server ip");
  }

  return data.ip
}