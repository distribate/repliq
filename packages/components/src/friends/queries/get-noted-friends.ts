"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";
import { FriendNotesEntity } from "@repo/types/entities/entities-type.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export async function getNotedFriends() {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  const { data, error } = await api
    .from("friends_notes")
    .select()
    .eq("initiator", currentUser.nickname)
    .returns<FriendNotesEntity[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
