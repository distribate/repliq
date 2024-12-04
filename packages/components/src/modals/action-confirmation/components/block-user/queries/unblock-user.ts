"use server";

import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export async function unblockUser(requestedNickname: string) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  if (currentUser.nickname === requestedNickname) return;

  const { error } = await api
    .from("users_blocked")
    .delete()
    .eq("initiator", currentUser.nickname)
    .eq("recipient", requestedNickname);

  if (error) {
    return false;
  }

  return !error;
}
