"use server";

import "server-only";
import { createClient } from "@repo/shared/api/supabase-client.ts";
import { getCurrentSession } from "#actions/get-current-session.ts";

export async function checkAdminPermission(): Promise<boolean> {
  const { user } = await getCurrentSession();
  if (!user) return false;

  const api = createClient();

  const { data, error } = await api
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (error) return false;

  return !!data.id;
}
