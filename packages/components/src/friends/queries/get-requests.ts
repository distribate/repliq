"use server";

import "server-only";
import { createClient } from "@repo/shared/api/supabase-client.ts";

export async function getRequests(nickname: string) {
  const api = createClient();

  const { data, error } = await api
    .from("friends_requests")
    .select("recipient, initiator, created_at")
    .or(`initiator.eq.${nickname},recipient.eq.${nickname}`);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
